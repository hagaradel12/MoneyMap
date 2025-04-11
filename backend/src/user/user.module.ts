import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { Users, UsersSchema } from './user.schema'; // Assuming your schema is in users.schema.ts

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]), // Register your schema with Mongoose
  ],
  controllers: [UsersController],
  providers: [UsersService ],
  exports: [UsersService],  // Export UsersService so it can be used in other modules
})
export class UserModule {}