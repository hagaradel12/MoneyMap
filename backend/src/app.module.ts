import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { CurrencyService } from './currency/currency.service';
import { Wallet } from './wallet/wallet.schema';
import { WalletModule } from './wallet/wallet.module';
import { ExpensesModule } from './expenses/expenses.module';
import { HttpModule } from '@nestjs/axios';
import { NotificationController } from './notifications/notifications.controller';
import { NotificationService } from './notifications/notifications.service';
import { NotificationModule } from './notifications/notifications.module';
import { RemindersService } from './reminders/reminders.service';
import { RemindersController } from './reminders/reminders.controller';
import { RemindersModule } from './reminders/reminders.module';
// Load environment variables from .env file
dotenv.config();

@Module({
  imports: [
    UserModule,
    AuthModule,
    WalletModule,
    ExpensesModule,
    NotificationModule,
    HttpModule,    
    //Config and connections
    ConfigModule.forRoot({
    isGlobal: true,
  }),
  MongooseModule.forRoot(process.env.MONGO_URI, {
    dbName: process.env.DATABASE_NAME,
  }),
  NotificationModule,
  RemindersModule,],

  controllers: [AppController],
  providers: [AppService, CurrencyService],
})
export class AppModule {}