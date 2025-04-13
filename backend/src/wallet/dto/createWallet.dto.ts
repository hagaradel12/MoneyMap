import { IsString, IsNumber } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  currency: string;


  @IsNumber()
  balance: number;


}