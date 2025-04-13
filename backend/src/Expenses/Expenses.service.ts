import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Expenses } from "./Expenses.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ExpensesDocument } from "./Expenses.schema";
import { CreateExpenseDto } from "./dto/createExpense.dto";
import { Wallet, WalletDocument } from "src/wallet/wallet.schema";
import { WalletService } from "src/wallet/wallet.service";


@Injectable()
export class ExpensesService{
constructor(@InjectModel(Expenses.name) private expensesModel: Model<ExpensesDocument>,
@InjectModel(Wallet.name) private readonly walletModel: Model<WalletDocument>,
@Inject(forwardRef(() => WalletService)) private readonly walletService: WalletService,

) {}

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
  async findAll(): Promise<Expenses[]> {
    return this.expensesModel.find().exec();
  }

}