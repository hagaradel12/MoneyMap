import { IsString, Length } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @Length(1, 500, { message: 'Message must be between 1 and 500 characters' })
  message: string;
}
