import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { NotificationModule } from './notification/notification.module';
import { WalletModule } from './wallet/wallet.module';
import { RemindersController } from './reminders/reminders.controller';
import { RemindersService } from './reminders/reminders.service';
// Load environment variables from .env file
dotenv.config();

@Module({
  imports: [
    UserModule,
    AuthModule,
    
    //Config and connections
    ConfigModule.forRoot({
    isGlobal: true,
  }),
  MongooseModule.forRoot(process.env.MONGO_URI, {
    dbName: process.env.DATABASE_NAME,
  }),
  NotificationModule,
  WalletModule,],

  controllers: [AppController, RemindersController],
  providers: [AppService, RemindersService],
})
export class AppModule {}