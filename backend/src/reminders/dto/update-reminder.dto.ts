import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class UpdateReminderDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  flag?: boolean;
}