import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule

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
  }),],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
