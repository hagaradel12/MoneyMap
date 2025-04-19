export class CreateExpenseDto {
  name: string;
  category: string;
  price: number;
  paymentMethod: string;
  date: Date;
  flagForIncome: boolean;
}