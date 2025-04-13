import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Users>;

@Schema()
export class Users {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Wallet' })
  wallet: mongoose.Types.ObjectId; //reference to the Wallet schema
}

export const UsersSchema = SchemaFactory.createForClass(Users);