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


import { AddReminderDto } from './dto/add-reminder.dto';
import { AddNotificationDto } from './dto/add-notification.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Reminder, ReminderDocument } from 'src/reminders/reminders.schema';
import { Notification , NotificationDocument } from 'src/notifications/notifications.schema';


@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private usersModel: Model<UserDocument>,
  @InjectModel('Wallet') private readonly walletModel: Model<WalletDocument>,
  @InjectModel(Reminder.name) private reminderModel: Model<ReminderDocument>,
  @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
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
  

// User Reminders and Notifications

// Add Reminder
async addReminder(email: string, addReminderDto: AddReminderDto): Promise<Users> {
  const reminder = await this.reminderModel.create(addReminderDto);

  const user = await this.usersModel.findOneAndUpdate(
    { email: email }, 
    { $push: { reminders: reminder._id } },
    { new: true }
  );
  if (!user) throw new NotFoundException(`User with email ${email} not found`);
  return user;
}
// update Reminder
async updateReminder(email: string, reminderId: string, updateReminderDto: UpdateReminderDto): Promise<Users> {
  const reminder = await this.reminderModel.findByIdAndUpdate(
    reminderId,
    updateReminderDto,
    { new: true }
  );

  if (!reminder) throw new NotFoundException(`Reminder with ID ${reminderId} not found`);

  const user = await this.usersModel.findOne({ email });
  if (!user || !user.reminders.includes(reminderId as any)) {
    throw new NotFoundException(`User or reminder not found`);
  }

  return user;
}
// Remove Reminder
async removeReminder(email: string, reminderId: string): Promise<Users> {
  await this.reminderModel.findByIdAndDelete(reminderId);

  const user = await this.usersModel.findOneAndUpdate(
    { email: email }, 
    { $pull: { reminders: reminderId } },
    { new: true }
  );
  if (!user) throw new NotFoundException(`User with email ${email} not found`);
  return user;
}

// Clear all Reminders
async clearReminders(email: string): Promise<Users> {
  const user = await this.usersModel.findOne({ email: email }); // Changed from 'name' to 'email'
  if (!user) throw new NotFoundException(`User with email ${email} not found`);

  await this.reminderModel.deleteMany({ _id: { $in: user.reminders } });

  user.reminders = [];
  await user.save();
  return user;
}

// Add Notification
async addNotification(email: string, addNotificationDto: AddNotificationDto): Promise<Users> {
  const notification = await this.notificationModel.create(addNotificationDto);

  const user = await this.usersModel.findOneAndUpdate(
    { email: email }, 
    { $push: { notifications: notification._id } },
    { new: true }
  );
  if (!user) throw new NotFoundException(`User with email ${email} not found`);
  return user;
}
// Update Notification
async updateNotification(email: string, notificationId: string, updateNotificationDto: UpdateNotificationDto): Promise<Users> {
  const notification = await this.notificationModel.findByIdAndUpdate(
    notificationId,
    updateNotificationDto,
    { new: true }
  );

  if (!notification) throw new NotFoundException(`Notification with ID ${notificationId} not found`);

  const user = await this.usersModel.findOne({ email });
  if (!user || !user.notifications.includes(notificationId as any)) {
    throw new NotFoundException(`User or notification not found`);
  }

  return user;
}

// Clear all Notifications
async clearNotifications(email: string): Promise<Users> {
  const user = await this.usersModel.findOne({ email: email }); // Changed from 'name' to 'email'
  if (!user) throw new NotFoundException(`User with email ${email} not found`);

  await this.notificationModel.deleteMany({ _id: { $in: user.notifications } });

  user.notifications = [];
  await user.save();
  return user;
}

// Mark notification as read
async markNotificationAsRead(email: string, notificationId: string): Promise<Users> {
  await this.notificationModel.findByIdAndUpdate(notificationId, { isRead: true });

  const user = await this.usersModel.findOne({ email: email }); 
  if (!user || !user.notifications.includes(notificationId as any)) {
    throw new NotFoundException(`User or notification not found`);
  }
  return user;
}

// Remove notification
async removeNotification(email: string, notificationId: string): Promise<Users> {
  await this.notificationModel.findByIdAndDelete(notificationId);

  const user = await this.usersModel.findOneAndUpdate(
    { email: email }, 
    { $pull: { notifications: notificationId } },
    { new: true }
  );
  if (!user) throw new NotFoundException(`User or notification not found`);
  return user;
}
}