import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'Wallet' })
  wallet: Types.ObjectId;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Reminder' }]})
  reminders: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Notification' }] })
  notifications: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
