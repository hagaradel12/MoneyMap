export class CreateExpenseDto {
  name: string;
  category: number;
  price: number;
  paymentMethod: number;
  date: Date;
  flagForIncome: boolean;
}