import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './user.service';
import { Users } from './user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddReminderDto } from './dto/add-reminder.dto';
import { AddNotificationDto } from './dto/add-notification.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

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


// Reminders

@Post(':email/reminders')
async addReminder(
  @Param('email') email: string, 
  @Body() addReminderDto: AddReminderDto,
): Promise<Users> {
  return this.usersService.addReminder(email, addReminderDto); 
}


@Put(':email/reminders/:reminderId')
async updateReminder(
  @Param('email') email: string,
  @Param('reminderId') reminderId: string,
  @Body() updateReminderDto: UpdateReminderDto,
): Promise<Users> {
  return this.usersService.updateReminder(email, reminderId, updateReminderDto);
}

@Delete(':email/reminders/:reminderId')
async removeReminder(
  @Param('email') email: string, 
  @Param('reminderId') reminderId: string,
): Promise<Users> {
  return this.usersService.removeReminder(email, reminderId); 
}

@Delete(':email/reminders')
async clearReminders(
  @Param('email') email: string, 
): Promise<Users> {
  return this.usersService.clearReminders(email); 
}


// Notifications

@Post(':email/notifications')
async addNotification(
  @Param('email') email: string, 
  @Body() addNotificationDto: AddNotificationDto,
): Promise<Users> {
  return this.usersService.addNotification(email, addNotificationDto); 
}

@Put(':email/notifications/:notificationId')
async updateNotification(
  @Param('email') email: string,
  @Param('notificationId') notificationId: string,
  @Body() updateNotificationDto: UpdateNotificationDto,
): Promise<Users> {
  return this.usersService.updateNotification(email, notificationId, updateNotificationDto);
}

@Put(':email/notifications/:notificationId/read')
async markNotificationAsRead(
  @Param('email') email: string, 
  @Param('notificationId') notificationId: string,
): Promise<Users> {
  return this.usersService.markNotificationAsRead(email, notificationId); 
}

@Delete(':email/notifications/:notificationId')
async removeNotification(
  @Param('email') email: string, 
  @Param('notificationId') notificationId: string,
): Promise<Users> {
  return this.usersService.removeNotification(email, notificationId); 
}

@Delete(':email/notifications')
async clearNotifications(
  @Param('email') email: string, 
): Promise<Users> {
  return this.usersService.clearNotifications(email); 
}
}