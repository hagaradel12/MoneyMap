import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UserDocument } from './user.schema';
import { forwardRef, Inject } from '@nestjs/common'; // Import forwardRef and Inject for circular dependency resolution
import { WalletModule } from 'src/wallet/wallet.module'; // Import WalletModule if needed
import { Wallet, WalletSchema } from 'src/wallet/wallet.schema'; // Import Wallet schema if needed


import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WalletDocument } from 'src/wallet/wallet.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private usersModel: Model<UserDocument>,
  @InjectModel('Wallet') private readonly walletModel: Model<WalletDocument>,
) {}

  // CREATE NEW User FOR REGISTER
  // CREATE NEW User FOR REGISTER
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.usersModel({
      ...createUserDto,  // Spread the properties from CreateUserDto
    });
    return newUser.save();
  }
  
  // Get user by email
  async findUserByEmail(email: string){
    const user = await this.usersModel.findOne({ email }).exec();
    if (user) {
    return user;
    }
  }

  // Get wallet by email
  async getWalletByEmail(email: string): Promise<WalletDocument> {
      const user = (await this.usersModel.findOne({ email }).populate('wallet'));
      return await this.walletModel.findById(user.wallet).populate('expenses');  
  }

  // Update user by email
  async updateUser(email: string, updateUserDto: UpdateUserDto): Promise<Users> {
    const updatedUser = await this.usersModel.findOneAndUpdate(
      { email },
      { $set: updateUserDto },
      { new: true },  // Return the updated document
    ).exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return updatedUser;
  }

  // Delete user by email
  async deleteUser(email: string): Promise<void> {
    const result = await this.usersModel.deleteOne({ email }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
  }
}