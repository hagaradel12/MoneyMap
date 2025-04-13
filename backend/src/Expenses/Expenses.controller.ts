import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Patch } from '@nestjs/common';
import { CreateExpenseDto } from './dto/createExpense.dto';
import { UpdateExpenseDto } from './dto/updateExpense.dto';
import { ExpensesService } from './Expenses.service';
import { Expenses } from './Expenses.schema';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get(':id')
  async getExpenseById(@Param('id') id: string): Promise<Expenses> {
    return this.expensesService.findById(id);
  }

  @Post()
  async createExpense(@Body() createExpenseDto: CreateExpenseDto): Promise<Expenses> {
    return this.expensesService.createExpense(createExpenseDto);
  }

  @Delete(':id')
  async deleteExpenseById(@Param('id') id: string) {
    return this.expensesService.deleteById(id);
}
    
    @Put(':id')
  async updateExpenseById(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto): Promise<Expenses> {
    return this.expensesService.updateExpense(id, updateExpenseDto);
  }
}