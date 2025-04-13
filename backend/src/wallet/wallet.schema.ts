import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type WalletDocument = HydratedDocument<Wallet>;

@Schema({ timestamps: true })
export class Wallet {
  @Prop({ required: true })
  balance: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expenses' }], required: true, default: []})
  expenses: mongoose.Types.ObjectId[];
  
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
