import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './wallet.schema';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { ExpensesModule } from '../expenses/expenses.module';
import { Expenses, ExpensesSchema } from '../expenses/expenses.schema';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';
import { CurrencyModule } from 'src/currency/currency.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: Expenses.name, schema: ExpensesSchema }, 
    ]),
    forwardRef(() => ExpensesModule),
    HttpModule,
    forwardRef(() => UserModule),
    CurrencyModule,
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
