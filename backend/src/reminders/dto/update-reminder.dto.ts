
import { IsDateString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class UpdateReminderDto {

  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;

 
  @IsBoolean()
  @IsOptional()
  flag?: boolean;
}