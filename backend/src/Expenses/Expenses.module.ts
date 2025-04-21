import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { Expenses, ExpensesSchema } from './expenses.schema';
import { Wallet, WalletSchema } from 'src/wallet/wallet.schema';
import { Users, UsersSchema } from 'src/user/user.schema';
import { WalletModule } from 'src/wallet/wallet.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Expenses.name, schema: ExpensesSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: Users.name, schema: UsersSchema },
    ]),
    forwardRef(() => WalletModule), 
    forwardRef(() => UserModule), 

  ],
  providers: [ExpensesService],
  controllers: [ExpensesController],
  exports: [ExpensesService],
})
export class ExpensesModule {}
