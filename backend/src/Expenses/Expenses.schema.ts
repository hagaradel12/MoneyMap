import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExpensesDocument = HydratedDocument<Expenses>
// Define or import the Expenses schema
@Schema()
export class Expenses {
  @Prop()
  name: string;
  @Prop()
  category: string;
  @Prop()
  price: number;
  @Prop()
  paymentMethod: String;
  @Prop()
  date: Date;
  @Prop()
  flagForIncome: boolean;
}


export const ExpensesSchema = SchemaFactory.createForClass(Expenses);