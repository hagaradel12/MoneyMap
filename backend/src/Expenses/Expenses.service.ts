import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Expenses } from "./Expenses.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ExpensesDocument } from "./Expenses.schema";
import { CreateExpenseDto } from "./dto/createExpense.dto";
import { Wallet, WalletDocument } from "src/wallet/wallet.schema";
import { WalletService } from "src/wallet/wallet.service";
import { UpdateExpenseDto } from "./dto/updateExpense.dto";


@Injectable()
export class ExpensesService{
constructor(@InjectModel(Expenses.name) private expensesModel: Model<ExpensesDocument>,
@InjectModel(Wallet.name) private readonly walletModel: Model<WalletDocument>,
@Inject(forwardRef(() => WalletService)) private readonly walletService: WalletService,

) {}

//get expense by object id
async findById(id: string): Promise<Expenses> {
  const expense = await this.expensesModel.findById(id).exec();
  if (!expense) {
    throw new NotFoundException(`Expense with ID ${id} not found`);
  }
  return expense;
}

  async createExpense(createExpenseDto: CreateExpenseDto): Promise<Expenses> {
    const createdExpense = new this.expensesModel(createExpenseDto);
    
    // if(createdExpense.flagForIncome == true){
    //     await this.walletService.IncreaseBalance(
    //         createdExpense.price,)
    // }
    // else{
    //     await this.walletService.DecreaseBalance(
    //         createdExpense.price,)
    // }
    return createdExpense.save();
  }

  //delete expense by object id
  async deleteById(id: string): Promise<{ message: string }> {
    const result = await this.expensesModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return { message: `Expense with ID ${id} deleted successfully` };
}

async updateExpense(id: string, updateExpenseDto: UpdateExpenseDto): Promise<Expenses> {
    const updatedExpense = await this.expensesModel.findByIdAndUpdate(
      id,
      updateExpenseDto,
      { new: true }
    ).exec();

    if (!updatedExpense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return updatedExpense;
  }

}