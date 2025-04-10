import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Patch } from '@nestjs/common';
import { CreateExpenseDto } from './dto/createExpense.dto';
import { UpdateExpenseDto } from './dto/updateExpense.dto';
import { ExpensesService } from './Expenses.service';
import { Expenses } from './Expenses.schema';

export class ExpensesController{


}