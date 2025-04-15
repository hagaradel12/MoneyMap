import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel} from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationDocument } from './notifiacation.schema';
import { UserDocument, Users } from 'src/user/user.schema';
import { Wallet, WalletDocument } from 'src/wallet/wallet.schema';

@Injectable()
export class NotificationService {

    constructor(
        @InjectModel(Notification.name)
        private readonly notificationModel: Model<NotificationDocument>,
    
        @InjectModel(Users.name)
        private readonly userModel: Model<UserDocument>,
    
        @InjectModel(Wallet.name)
        private readonly walletModel: Model<WalletDocument>,
      ) {}

    //GET ALL NOTIFCATIONS OF A USER
      async getUserNotifications(email: string): Promise<NotificationDocument[]> {
        const user = await this.userModel
          .findById(email)
          .populate('notifications')  
          .exec();
    
        if (!user) {
          throw new Error('User not found.');
        }
    
        return user.notifications;  
      }
    

 //CREATE NOTIFICATION
  // Add the cron job to run daily
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) 
  
  async createNotifications() {

    const users = await this.userModel.find()
    .populate('reminders')
    .populate('wallet');  

  const now = new Date();

  for (const user of users) {
    let userNeedsUpdate = false;

    // notfictaion for reminders
    for (const reminder of user.reminders) {
      const diffInDays = Math.ceil(
        (new Date(reminder.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffInDays <= 2 && diffInDays >= 0) {
        const newNotif = await this.notificationModel.create({
          title: 'Reminder',
          description: `You have a bill due in ${diffInDays} days: '${reminder.name}'`,
          isRead: false,
          createdAt: new Date(),
        });

        user.notifications.push(newNotif._id);  
        userNeedsUpdate = true;
      }
    }

    // check balance after each month
    const isLastDay = now.getDate() === new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    if (isLastDay && user.wallet) { 
      const wallet = user.wallet;
      
      if (wallet.balance > 0) {
        const newNotif = await this.notificationModel.create({
          title: 'Savings',
          description: `You saved $${wallet.balance} this month`,
          isRead: false,
          createdAt: new Date(),
        });

        user.notifications.push(newNotif._id);  
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
    const user = await this.userModel.findById(email);
    if (!user) throw new NotFoundException('User not found');

    // Mark all notifications as read
    await this.notificationModel.updateMany(
      { _id: { $in: user.notifications } },
      { $set: { isRead: true } }
    );

    // Call the deletion API logic directly
    return this.deleteReadNotifications(userId);
  }



// DELETE READ NOTIFICATIONS OF USER 
  async deleteReadNotifications(email: string) {
    const user = await this.userModel.findById(email);
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
      id => !readIds.some(readId => readId.equals(id))
    );

    await user.save();

    return { message: 'Read notifications deleted successfully.' };
  }
}
