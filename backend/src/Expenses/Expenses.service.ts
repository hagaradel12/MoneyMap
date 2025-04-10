import { Injectable } from "@nestjs/common";
import { Expenses } from "./Expenses.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ExpensesDocument } from "./Expenses.schema";

@Injectable()
export class ExpensesService{

}