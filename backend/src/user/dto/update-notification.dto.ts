import { IsString, IsOptional } from 'class-validator';

export class UpdateNotificationDto {
    @IsString()
    @IsOptional()
    title?: string;
  
    @IsString()
    @IsOptional()
    message?: string;
  
    @IsOptional()
    isRead?: boolean;
  }

  