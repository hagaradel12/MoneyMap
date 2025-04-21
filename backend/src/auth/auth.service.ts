import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/signIn.dto';

dotenv.config();

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async register(user: RegisterDto): Promise<string> {
        const existingUser = await this.usersService.findUserByEmail(user.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Create a new user object for saving
        const newUser: CreateUserDto = {
            ...user,
            passwordHash: hashedPassword, // Correct field name
        };

        // Save the new user to the database
        await this.usersService.create(newUser);

        return 'Registered successfully';
    }

    async login(signinDto: SignInDto) {
        const { email, password } = signinDto;

        console.log(`Attempting login for email: ${email}`);

        // Find user by email
        const user = await this.usersService.findUserByEmail(email);
        if (!user) {
            console.error(`User not found for email: ${email}`);
            throw new NotFoundException('User not found');
        }

        console.log('Password Provided:', password);
        console.log('Password Stored:', user.passwordHash);

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        console.log('Password Validation Result:', isPasswordValid);

        if (!isPasswordValid) {
            console.error(`Invalid password for user: ${email}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        console.log(`User authenticated: ${email}, generating token...`);

        // JWT payload
        const payload = { email: user.email};
        console.log('Payload met');

        const secret = process.env.JWT_SECRET || 'yourSuperSecretKey';
        const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
        console.log('JWT Configuration:', { secret, expiresIn });

        // Generate token
        const token = await this.jwtService.signAsync(payload, { expiresIn });
        console.log('Generated token:', token);




        return {
            access_token: token,
            payload,
        };
    }

}