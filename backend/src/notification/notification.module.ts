import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notifiacation.schema';
import { Users, UsersSchema } from '../user/user.schema';
import { Wallet, WalletSchema } from '../wallet/wallet.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: Users.name, schema: UsersSchema },
      { name: Wallet.name, schema: WalletSchema },
    ]),
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}