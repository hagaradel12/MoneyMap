import { IsString } from 'class-validator';

export class AddReminderDto {
  @IsString()
  content: string;
}
