
import { IsDateString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateReminderDto {

  @IsNotEmpty()
  title: string;


  @IsDateString()
  dueDate: Date;

  @IsBoolean()
  @IsOptional()
  flag?: boolean;
}