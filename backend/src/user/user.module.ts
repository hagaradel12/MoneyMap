import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { Users, UsersSchema } from './user.schema'; // Assuming your schema is in users.schema.ts
import { Wallet, WalletSchema } from 'src/wallet/wallet.schema';
import { WalletModule } from 'src/wallet/wallet.module'; // Import WalletModule if needed
import { ExpensesModule } from 'src/expenses/expenses.module';
import { RemindersModule } from 'src/reminders/reminders.module';
import { Reminder,ReminderSchema } from 'src/reminders/reminders.schema';
import { Notification, NotificationSchema } from 'src/notifications/notifications.schema';
import { NotificationModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: Reminder.name, schema: ReminderSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    forwardRef(() => WalletModule),
    forwardRef(() => ExpensesModule),
    forwardRef(() => RemindersModule),
    forwardRef(() => NotificationModule)
  ],
  controllers: [UsersController],
  providers: [UsersService ],
  exports: [UsersService],  // Export UsersService so it can be used in other modules
})
export class UserModule {}