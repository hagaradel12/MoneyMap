import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { SignInDto } from './dto/signIn.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('get-cookie-data')
    getCookieData(@Req() req: Request) {
        const cookies = req.cookies;
        const userData = cookies['user_data'];

        if (!userData) {
            throw new HttpException('No user data found in the cookie', HttpStatus.NOT_FOUND);
        }

        return { userData };
    }

    @Post('login')
    async login(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response) {
        try {
            console.log('Attempting login...');
            // Call the AuthService to handle login
            const result = await this.authService.login(signInDto);

            // Combine data into a single object
            const combinedData = {
                token: result.access_token,
                email: result.payload.email,
            };

            // Convert the object to a JSON string
            const combinedDataString = JSON.stringify(combinedData);

            // Set the single cookie
            res.cookie('user_data', combinedDataString, {
                httpOnly: true,  // Prevents client-side JavaScript access
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                maxAge: 86400 * 1000, // Cookie expiration time in milliseconds
                // sameSite: 'None', // Allow cookies in cross-origin requests
            });

            console.log(combinedDataString)
            

            // Return success response
            return {
                statusCode: HttpStatus.OK,
                message: 'Login successful',
                user: result.payload,
                access_token: result.access_token,
            };
        } catch (error) {
            console.log(error);

            // Handle specific errors
            if (error instanceof HttpException) {
                throw error; // Pass through known exceptions
            }

            // Handle other unexpected errors
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'An error occurred during login',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('register')
    async register(@Body() registerRequestDto: RegisterDto) {
        try {
            // Call the AuthService to handle registration
            const result = await this.authService.register(registerRequestDto);

            // Return a success response with HTTP 201 Created status
            return {
                statusCode: HttpStatus.CREATED,
                message: 'User registered successfully',
                data: result, // Include more details here if necessary
            };
        } catch (error) {
            console.log(error);

            // Handle specific errors, such as email already exists or validation errors
            if (error.status === 409) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.CONFLICT,
                        message: 'User with this email already exists',
                    },
                    HttpStatus.CONFLICT,
                );
            }

            // Handle other errors (e.g., validation errors)
            if (error.status === 400) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.BAD_REQUEST,
                        message: 'Invalid input data',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Catch any other errors and throw a generic internal server error
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'An error occurred during registration',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}