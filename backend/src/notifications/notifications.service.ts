import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel} from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Notification,NotificationDocument } from './notifications.schema';
import { UserDocument, Users } from 'src/user/user.schema';
import { Wallet, WalletDocument } from 'src/wallet/wallet.schema';
import {Reminder, ReminderDocument } from 'src/reminders/reminders.schema';



@Injectable()
export class NotificationService {

    constructor(
        @InjectModel(Notification.name)
        private readonly notificationModel: Model<NotificationDocument>,
    
        @InjectModel(Users.name)
        private readonly userModel: Model<UserDocument>,
    
        @InjectModel(Wallet.name)
        private readonly walletModel: Model<WalletDocument>,

        @InjectModel(Reminder.name)
        private readonly remindersModel: Model<ReminderDocument>,
      ) {}

    //GET ALL NOTIFCATIONS OF A USER
    async getUserNotifications(email: string): Promise<NotificationDocument[]> {
      const user = await this.userModel.findOne({ email }).exec();
    
      if (!user) {
        throw new Error('User not found.');
      }
    
      const notifications: NotificationDocument[] = [];
    
      for (const notifId of user.notifications) {
        const notif = await this.notificationModel.findById(notifId).exec();
        if (notif) {
          notifications.push(notif);
        }
      }
    
      return notifications;
    }
    

 //CREATE NOTIFICATION
  // Add the cron job to run daily
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) 
  
  async createNotifications() {

    const users = await this.userModel.find()
    .populate('wallet');  

  const now = new Date();

  for (const user of users) {
    let userNeedsUpdate = false;

    for (const remid of user.reminders) {
      const reminder = await this.remindersModel.findById(remid).lean().exec();
    // notfictaion for reminders
      const diffInDays = Math.ceil(
        (new Date(reminder?.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffInDays <= 2 && diffInDays >= 0) {
        const newNotif = await this.notificationModel.create({
          title: 'Reminder',
          description: `You have a bill due in ${diffInDays} days: '${reminder.name}'`,
          isRead: false,
          createdAt: new Date(),
        }) as NotificationDocument;

        user.notifications.push(newNotif._id as Types.ObjectId);  
        userNeedsUpdate = true;
      }
    }

    // check balance after each month
    const isLastDay = now.getDate() === new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

if (isLastDay && user.wallet) {
  const walletId = user.wallet as Types.ObjectId;

  const wallet = await this.walletModel.findById(walletId).lean();

  if (wallet && wallet.balance > 0) {
    const newNotif = await this.notificationModel.create({
      title: 'Savings',
      description: `You saved $${wallet.balance} this month`,
      isRead: false,
      createdAt: new Date(),
    });

    user.notifications.push(newNotif._id as Types.ObjectId);
    userNeedsUpdate = true;
  }
}

    
    if (userNeedsUpdate) {
      await user.save();  
    }
  }
    
  }

// UPDATE NOTIFCIATIONS OF USER TO READ 
  async markAllNotificationsAsRead(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    // Mark all notifications as read
    await this.notificationModel.updateMany(
      { _id: { $in: user.notifications } },
      { $set: { isRead: true } }
    );

    // Call the deletion API logic directly
    return this.deleteReadNotifications(email);
  }



// DELETE READ NOTIFICATIONS OF USER 
  async deleteReadNotifications(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    // Find all read notifications
    const readNotifs = await this.notificationModel.find({
      _id: { $in: user.notifications },
      isRead: true,
    });

    const readIds = readNotifs.map(n => n._id);

    // Delete read notifications
    await this.notificationModel.deleteMany({ _id: { $in: readIds } });

    // Remove from user's notification array
    user.notifications = user.notifications.filter(
      id => !readIds.some(readId => (readId as Types.ObjectId).equals(id as Types.ObjectId))
    );

    await user.save();

    return { message: 'Read notifications deleted successfully.' };
  }
}