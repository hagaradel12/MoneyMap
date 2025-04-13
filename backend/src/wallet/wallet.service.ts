import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Wallet, WalletDocument } from './wallet.schema';
import { CreateWalletDto } from './dto/createWallet.dto';
import { CurrencyService } from 'src/currency/currency.service';
import { ExpensesService } from 'src/Expenses/Expenses.service';
import { Expenses, ExpensesDocument } from 'src/Expenses/Expenses.schema';
import { UsersService } from '../user/user.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(Expenses.name) private expensesModel: Model<ExpensesDocument>,

    private readonly currencyService: CurrencyService,
    private readonly expensesService: ExpensesService,
    private readonly userService: UsersService,
  ) {}

  //create wallet takes dto (currency and balance, expenses array [] by default)
  async create(walletDto: CreateWalletDto): Promise<Wallet> {
    const wallet = new this.walletModel(walletDto);
    return wallet.save();
  }

  //find wallet by its id
  async findById(id: mongoose.Types.ObjectId): Promise<Wallet> {
    return await this.walletModel.findById(id).populate('expenses');
  }

//update currency of wallet
async update(id: mongoose.Types.ObjectId, newCurrency: string) {
    //get wallet using wallet id
    const wallet = await this.findById(id);
    if (!wallet) throw new Error('Wallet not found');
  
    const oldCurrency = wallet.currency;
    const oldBalance = wallet.balance;
  
    //convert the wallet balance to the new currency using the currency serive api to convert rate
    //acc to real time exchange rate
    const newBalance = await this.currencyService.convert(oldBalance, oldCurrency, newCurrency);
  
    //convert each expense to the new currency
    //loop on all expenses in wallet, populate each using findExpenseByExpenseId found
    //in expenses service and then take each expense and convert it into the new currency, then save the expense 
    //to have the new amount
    const updateExpensesPromises = wallet.expenses.map(async (expense) => {
        const pop_expense = await this.expensesModel.findById(expense); // Assuming `expense` contains `_id`
        const newAmount = await this.currencyService.convert(pop_expense.price, oldCurrency, newCurrency);
        pop_expense.price = newAmount;
        await pop_expense.save();
      });

          // Wait for all expense updates to complete
    await Promise.all(updateExpensesPromises);
  
    //update the wallet with the new currency and the new balance
    const updatedWallet = await this.walletModel.findByIdAndUpdate(id,
      { currency: newCurrency, balance: newBalance }, { new: true, runValidators: true },);
  
    return updatedWallet;
  }
  


//increase balance according to income amount and username
//first find wallet by username then change its balance
//this is called when we create an expense since we will have the user's username
//and the amount of the expense
  async incBalance(username: string, amount: number) {
    //+ findWalletByUsername in user to find wallet of user by their username
    //it returns wallet populated
    const wallet: WalletDocument = await this.userService.getWalletByUsername(username);
    const new_balance = wallet.balance + amount;
    return this.walletModel.findByIdAndUpdate(wallet._id, {balance: new_balance}, { new: true });
  }

  async decBalance(username: string, amount: number) {
    //+ findWalletByUsername in user to find wallet of user by their username
    //it returns wallet populated
    const wallet = await this.userService.getWalletByUsername(username);
    const new_balance = wallet.balance - amount;
    return this.walletModel.findByIdAndUpdate(wallet._id, {balance: new_balance}, { new: true });
  }



 
}
