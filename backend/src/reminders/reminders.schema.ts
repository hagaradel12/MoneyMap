import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReminderDocument = Reminder & Document;  // Hydrated document type

@Schema({ timestamps: true })
export class Reminder {
  @Prop({ required: true })
  title: string;

  @Prop()
  dueDate: Date;

  @Prop({ default: false })
  read: boolean;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: false })
  flag: boolean;
}


export const ReminderSchema = SchemaFactory.createForClass(Reminder);