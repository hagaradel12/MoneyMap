import { Module } from '@nestjs/common';
import { ReminderSchema } from './reminders.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from 'src/notifications/notifications.service';
import { NotificationController } from 'src/notifications/notifications.controller';
import { Notification, NotificationSchema } from 'src/notifications/notifications.schema';
import { Users,UsersSchema } from 'src/user/user.schema';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Reminder', schema: ReminderSchema }]),
    MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }]),
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }])

  ],
  providers: [RemindersService,],
  controllers: [RemindersController],
})
export class RemindersModule {}
