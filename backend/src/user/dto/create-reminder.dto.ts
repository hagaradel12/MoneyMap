import { IsString, IsDateString, IsOptional, Length } from 'class-validator';

export class CreateReminderDto {
  @IsString()
  @Length(1, 100, { message: 'Title must be between 1 and 100 characters' })
  title: string;

  @IsDateString()
  date: string; 

  @IsString()
  @IsOptional()
  @Length(0, 500, { message: 'Description cannot exceed 500 characters' })
  description?: string;
}