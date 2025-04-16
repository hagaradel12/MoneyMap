import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<Users>;

@Schema({ timestamps: true })
export class Users {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'Wallet', required: false })
  wallet: Types.ObjectId;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Reminder' }], default: [] })
  reminders: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Notification' }], default: [] })
  notifications: Types.ObjectId[];
}

export const UsersSchema = SchemaFactory.createForClass(Users);



  
