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
// Load environment variables from .env file
dotenv.config();

@Module({
  imports: [
    UserModule,
    AuthModule,
    WalletModule,
    ExpensesModule,
    HttpModule,    
    //Config and connections
    ConfigModule.forRoot({
    isGlobal: true,
  }),
  MongooseModule.forRoot(process.env.MONGO_URI, {
    dbName: process.env.DATABASE_NAME,
  }),],

  controllers: [AppController],
  providers: [AppService, CurrencyService],
})
export class AppModule {}