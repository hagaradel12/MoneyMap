import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument } from 'mongoose';

export type WalletDocument = HydratedDocument<Wallet>;
@Schema({ timestamps: true })
export class Wallet  {
  @Prop({ required: true })
  balance: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ type: [Object], default: [] })
  expenses: any[]; 
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);