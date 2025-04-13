export class UpdateExpenseDto {
  name?: string;
  category?: number;
  price?: number;
  paymentMethod?: String;
  date?: Date;
  flagForIncome?: boolean;
}