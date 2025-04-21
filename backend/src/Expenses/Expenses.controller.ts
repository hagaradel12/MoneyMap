import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Patch } from '@nestjs/common';
import { CreateExpenseDto } from './dto/createExpense.dto';
import { UpdateExpenseDto } from './dto/updateExpense.dto';
import { ExpensesService } from './expenses.service';
import { Expenses } from './expenses.schema';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get(':id')
  async getExpenseById(@Param('id') id: string): Promise<Expenses> {
    return this.expensesService.findById(id);
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string): Promise<Expenses []> {
    return this.expensesService.findByName(name);
  }

  @Get('category/:category')
  async findByCategory(@Param('category') category: string): Promise<Expenses []> {
    return this.expensesService.findByCategory(category);
  }

  //email of user to be able to add expense to wallets's array of expenses and change user's balance in wallet
  @Post(':email')
  async createExpense(@Param('email') email: string, @Body() createExpenseDto: CreateExpenseDto): Promise<Expenses> {
    return this.expensesService.createExpense(email, createExpenseDto);
  }

  //delete expense and remove it from user's array of expenses AND UPDATE balance in wallet
  @Delete(':email/:id')
  async deleteExpenseById(@Param('email') email:string, @Param('id') id: string) {
    return this.expensesService.deleteById(email, id);
}
    
    @Put(':id')
  async updateExpenseById(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto): Promise<Expenses> {
    return this.expensesService.updateExpense(id, updateExpenseDto);
  }
}