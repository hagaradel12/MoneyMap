import { IsString } from 'class-validator';

export class AddNotificationDto {
  @IsString()
  message: string;
}
