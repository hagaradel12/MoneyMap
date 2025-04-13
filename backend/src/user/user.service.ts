import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UserDocument } from './user.schema';


import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WalletDocument } from 'src/wallet/wallet.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private usersModel: Model<UserDocument>,
    private readonly walletModel: Model<WalletDocument>,
) {}

  // CREATE NEW User FOR REGISTER
  // CREATE NEW User FOR REGISTER
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.usersModel({
      ...createUserDto,  // Spread the properties from CreateUserDto
    });
    return newUser.save();
  }
  
  // Get user by username
  async findUserByUsername(username: string){
    const user = await this.usersModel.findOne({ username }).exec();
    if (user) {
    return user;
    }
  }

  // Get wallet by username
  async getWalletByUsername(username: string): Promise<WalletDocument> {
      const user = (await this.usersModel.findOne({ username }).populate('wallet'));
      return await this.walletModel.findById(user.wallet).populate('expenses');  
  }

  // Update user by username
  async updateUser(username: string, updateUserDto: UpdateUserDto): Promise<Users> {
    const updatedUser = await this.usersModel.findOneAndUpdate(
      { username },
      { $set: updateUserDto },
      { new: true },  // Return the updated document
    ).exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return updatedUser;
  }

  // Delete user by username
  async deleteUser(username: string): Promise<void> {
    const result = await this.usersModel.deleteOne({ username }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
  }
}