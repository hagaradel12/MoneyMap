import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './user.service';
import { Users } from './user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddReminderDto } from './dto/add-reminder.dto';
import { AddNotificationDto } from './dto/add-notification.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  // Get user by username
  @Get(':username')
  async findUserByUsername(@Param('username') username: string) {
    return this.usersService.findUserByUsername(username);
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


////////////////////////////////
// User Reminders and Notifications

//Reminders

@Post(':username/reminders')
async addReminder(
  @Param('username') username: string,
  @Body() addReminderDto: AddReminderDto,
): Promise<Users> {
  return this.usersService.addReminder(username, addReminderDto);
}

@Delete(':username/reminders/:reminderId')
async removeReminder(
  @Param('username') username: string,
  @Param('reminderId') reminderId: string,
): Promise<Users> {
  return this.usersService.removeReminder(username, reminderId);
}

@Delete(':username/reminders')
async clearReminders(@Param('username') username: string): Promise<Users> {
  return this.usersService.clearReminders(username);
}




//Notifications

@Post(':username/notifications')
async addNotification(
  @Param('username') username: string,
  @Body() addNotificationDto: AddNotificationDto,
): Promise<Users> {
  return this.usersService.addNotification(username, addNotificationDto);
}

@Put(':username/notifications/:notificationId/read')
async markNotificationAsRead(
  @Param('username') username: string,
  @Param('notificationId') notificationId: string,
): Promise<Users> {
  return this.usersService.markNotificationAsRead(username, notificationId);
}


@Delete(':username/notifications/:notificationId')
async removeNotification(
  @Param('username') username: string,
  @Param('notificationId') notificationId: string,
): Promise<Users> {
  return this.usersService.removeNotification(username, notificationId);
}


@Delete(':username/notifications')
async clearNotifications(
  @Param('username') username: string,
): Promise<Users> {
  return this.usersService.clearNotifications(username);
}

}




