import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReminderDocument = Reminder & Document;  // Hydrated document type

@Schema()
export class Reminder {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: false })
  flag: boolean;

  @Prop({ default: false })
  deleted: boolean;  // A flag to mark if the reminder is deleted (soft delete)
}

export const ReminderSchema = SchemaFactory.createForClass(Reminder);
