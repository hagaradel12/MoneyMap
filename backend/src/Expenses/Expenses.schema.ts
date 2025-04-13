import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Define or import the Expenses schema
@Schema()
export class Expenses {
  @Prop()
  name: string;
  @Prop()
  category: number;
  @Prop()
  price: number;
  @Prop()
  paymentMethod: String;
  @Prop()
  date: Date;
  @Prop()
  flagForIncome: boolean;
}

export type ExpensesDocument = HydratedDocument<Expenses>;