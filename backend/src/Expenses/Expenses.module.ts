import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Expenses, ExpensesSchema } from './expenses.schema';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Expenses.name, schema: ExpensesSchema }
    ]),
  ],
  providers: [ExpensesService],
  controllers: [ExpensesController],
})
export class ExpensesModule {}