import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { NotificationService } from './notifications.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  //GET ALL NOTIFCATIONS OF A USER 
  @Get('user/:userId')
  async getUserNotifications(@Param('userId') userId: string) {
    try {
      const notifications = await this.notificationService.getUserNotifications(userId);

      if (notifications.length === 0) {
        return { message: 'No notifications found for this user.' };
      }

      return notifications;  // Returns the hydrated Notification documents
    } catch (error) {
      return { message: 'Error fetching notifications.', error: error.message };
    }
  }

  // Endpoint to trigger notifications creation
  @Post('create')
  async createNotifications() {
    try {
      await this.notificationService.createNotifications();
      return { message: 'Notifications created successfully.' };
    } catch (error) {
      return { message: 'Error creating notifications.', error: error.message };
    }
  }

  @Patch('mark-all-read/:userId')
  async markAllAsRead(@Param('userId') userId: string) {
    return this.notificationService.markAllNotificationsAsRead(userId);
  }

  @Delete('delete-read/:userId')
  async deleteReadNotifications(@Param('userId') userId: string) {
    return this.notificationService.deleteReadNotifications(userId);
  }
}