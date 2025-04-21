import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Expenses } from "./expenses.schema";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { ExpensesDocument } from "./expenses.schema";
import { CreateExpenseDto } from "./dto/createExpense.dto";
import { Wallet, WalletDocument } from "src/wallet/wallet.schema";
import { WalletService } from "src/wallet/wallet.service";
import { UpdateExpenseDto } from "./dto/updateExpense.dto";
import { IsEmail } from "class-validator";
import { Users, UserDocument } from "src/user/user.schema";


@Injectable()
export class ExpensesService{
constructor(@InjectModel(Expenses.name) private expensesModel: Model<ExpensesDocument>,
@InjectModel(Wallet.name) private readonly walletModel: Model<WalletDocument>,
@InjectModel(Users.name) private readonly userModel: Model<UserDocument>,
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

//get expense by Name
async findByName(named: string): Promise<Expenses []> {
  const expense = await this.expensesModel.find({ name: named }).exec();
  if (!expense) {
    throw new NotFoundException(`Expense with name ${named} not found`);
  }
  return expense;
}

//get expense by Name
async findByCategory(cat: string): Promise<Expenses []> {
  const expense = await this.expensesModel.find({ category: cat }).exec();
  if (!expense) {
    throw new NotFoundException(`Expense with category ${cat} not found`);
  }
  return expense;
}

//takes email and expense dto
//add expense to wallet's array of expenses
//change user's balance in wallet
  async createExpense(email: string, createExpenseDto: CreateExpenseDto): Promise<Expenses> {
    const createdExpense = new this.expensesModel(createExpenseDto);
    
    if(createdExpense.flagForIncome == true){
        await this.walletService.incBalance(email,
            createdExpense.price)
    }
    else{
        await this.walletService.decBalance(email,
            createdExpense.price)
    }
    //add expense to wallet's array of expenses
    const user = await this.userModel.findOne({ email }).populate('wallet').exec();
    const wallet = user.wallet;
    const pop_wallet = await this.walletModel.findById(wallet._id).populate('expenses').exec();
    pop_wallet.expenses.push(createdExpense._id);
    await user.save();
    await pop_wallet.save();
    return createdExpense.save();
  }

  //delete expense by object id
  async deleteById(email:string, id: string): Promise<void> {
    const result = await this.expensesModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    const user = await this.userModel.findOne({ email }).populate('wallet').exec();
    const wallet = user.wallet;
    const pop_wallet = await this.walletModel.findById(wallet._id).populate('expenses').exec();
    const oid = new mongoose.Types.ObjectId(id);
    const index = pop_wallet.expenses.indexOf(oid);
    if (index > -1) {
      pop_wallet.expenses.splice(index, 1); //remove the expense ID from the array
    }
    await user.save();
    await pop_wallet.save();

    if(result.flagForIncome == true){
      await this.walletService.decBalance(email, //dec balance when deleting income
        result.price)
  }
  else{
      await this.walletService.incBalance(email,
        result.price)
  }

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