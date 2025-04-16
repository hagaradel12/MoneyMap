import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './user.service';
import { Users } from './user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  // Get user by email
  @Get(':email')
  async findUserByEmail(@Param('email') email: string) {
    return this.usersService.findUserByEmail(email);
  }

  //get wallet by email
  @Get('wallet/:email/')
  async getWalletByEmail(@Param('email') email: string) {
    return this.usersService.getWalletByEmail(email);
  }

  // Update user by email
  @Put(':email')
  async updateUser(
    @Param('email') email: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Users> {
    return this.usersService.updateUser(email, updateUserDto);
  }

  // Delete user by email
  @Delete(':email')
  async deleteUser(@Param('email') email: string): Promise<void> {
    return this.usersService.deleteUser(email);
  }
}