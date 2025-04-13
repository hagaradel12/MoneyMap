export class CreateExpenseDto {
  name: string;
  category: number;
  price: number;
  paymentMethod: String;
  date: Date;
  flagForIncome: boolean;
}