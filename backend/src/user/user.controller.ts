import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './user.service';
import { Users } from './user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  // Get user by username
  @Get(':username')
  async findUserByUsername(@Param('username') username: string) {
    return this.usersService.findUserByUsername(username);
  }

  //get wallet by username
  @Get('wallet/:username/')
  async getWalletByUsername(@Param('username') username: string) {
    return this.usersService.getWalletByUsername(username);
  }

  // Update user by username
  @Put(':username')
  async updateUser(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Users> {
    return this.usersService.updateUser(username, updateUserDto);
  }

  // Delete user by username
  @Delete(':username')
  async deleteUser(@Param('username') username: string): Promise<void> {
    return this.usersService.deleteUser(username);
  }
}