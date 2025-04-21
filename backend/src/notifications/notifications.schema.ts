import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; //prop is decoration :))
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: Date.now })
  date: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);