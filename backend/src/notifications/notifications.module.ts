import { forwardRef, Module } from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { NotificationController } from './notifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notifications.schema';
import { Users, UsersSchema } from '../user/user.schema';
import { Wallet, WalletSchema } from '../wallet/wallet.schema';
import { Reminder, ReminderSchema } from 'src/reminders/reminders.schema';
import { UserModule } from 'src/user/user.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { RemindersModule } from 'src/reminders/reminders.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: Users.name, schema: UsersSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: Reminder.name, schema: ReminderSchema },
    ]),
    forwardRef(() => UserModule),
        forwardRef(() => WalletModule),
        forwardRef(() => RemindersModule),
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}