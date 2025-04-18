import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Wallet, WalletSchema} from './wallet.schema';
import {CreateWalletDto} from './dto/createWallet.dto'
import mongoose from 'mongoose';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

 //create wallet using create wallet dto that takes currency and balance? as input, and expenses is 
 //initially an empty array
  @Post(':email')
  create(@Param('email') email: string, @Body() walletDto: CreateWalletDto) {
    return this.walletService.create(email, walletDto);
  }

  //get user's wallet by wallet id to display the balance and expenses
  @Get(':id')
  findById(@Param('id') id: string) {
    const oid= new mongoose.Types.ObjectId(id)
    return this.walletService.findById(oid);
  }

  //update wallet details for certain wallet id
  //user can only update currency, wallet is also updated by adding/removing expense
  //but that it not done manually inside wallet details
  //when changing currency, conversions should be done to balance, income, and expenses
  @Put(':id/:currency')
  update(@Param('id') id: string, @Param('currency') currency: string) {
    const oid = new mongoose.Types.ObjectId(id)
    return this.walletService.update(oid, currency);
  }
//increase balance according to income amount and username
//first find wallet by username then change its balance
  @Put(':email/:amount')
  incBalance(@Param('email') email: string, @Param('amount') amount: number) {
    return this.walletService.incBalance(email, amount);
  }

  //increase balance according to income amount and username
  @Put(':email/:amount')
  idecBalance(@Param('email') email: string, @Param('amount') amount: number) {
    return this.walletService.decBalance(email, amount);
  }



}
