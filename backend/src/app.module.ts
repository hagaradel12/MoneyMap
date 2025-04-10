import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserControllerController } from './user-controller/user-controller.controller';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController, UserControllerController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
