export class UpdateExpenseDto {
  name?: string;
  category?: number;
  price?: number;
  paymentMethod?: number;
  date?: Date;
  flagForIncome?: boolean;
}