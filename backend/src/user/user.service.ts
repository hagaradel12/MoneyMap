import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UserDocument } from './user.schema';


import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


import { AddReminderDto } from './dto/add-reminder.dto';
import { AddNotificationDto } from './dto/add-notification.dto';


@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private usersModel: Model<UserDocument>) {}

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
  

// User Reminders and Notifications

//Reminders
async addReminder(username: string, addReminderDto: AddReminderDto): Promise<Users> {
  const user = await this.usersModel.findOneAndUpdate(
    { username },
    { $push: { reminders: addReminderDto } },
    { new: true }
  );
  if (!user) throw new NotFoundException(`User with username ${username} not found`);
  return user;
}

///Removes a specific reminder
async removeReminder(username: string, reminderId: string): Promise<Users> {
  const user = await this.usersModel.findOneAndUpdate(
    { username },
    { $pull: { reminders: { _id: reminderId } } },
    { new: true }
  );
  if (!user) throw new NotFoundException(`User with username ${username} not found`);
  return user;
}

////Clears all reminders
async clearReminders(username: string): Promise<Users> {
  const user = await this.usersModel.findOneAndUpdate(
    { username },
    { $set: { reminders: [] } },
    { new: true }
  );
  if (!user) throw new NotFoundException(`User with username ${username} not found`);
  return user;
}
// Notifications

async addNotification(username: string, addNotificationDto: AddNotificationDto): Promise<Users> {
  const notification = { ...addNotificationDto, read: false };
  const user = await this.usersModel.findOneAndUpdate(
    { username },
    { $push: { notifications: notification } },
    { new: true }
  );
  if (!user) throw new NotFoundException(`User with username ${username} not found`);
  return user;
}

/////Clears all notifications
async clearNotifications(username: string): Promise<Users> {
  const user = await this.usersModel.findOneAndUpdate(
    { username },
    { $set: { notifications: [] } },
    { new: true }
  );
  if (!user) throw new NotFoundException(`User with username ${username} not found`);
  return user;
}
///Marks a specific notification as read
async markNotificationAsRead(username: string, notificationId: string): Promise<Users> {
  const user = await this.usersModel.findOneAndUpdate(
    { username, 'notifications._id': notificationId },
    { $set: { 'notifications.$.read': true } },
    { new: true }
  );
  if (!user) throw new NotFoundException(`User or notification not found`);
  return user;
}
///Removes a specific notification
async removeNotification(username: string, notificationId: string): Promise<Users> {
  const user = await this.usersModel.findOneAndUpdate(
    { username },
    { $pull: { notifications: { _id: notificationId } } },
    { new: true }
  );
  if (!user) throw new NotFoundException(`User or notification not found`);
  return user;
}


}