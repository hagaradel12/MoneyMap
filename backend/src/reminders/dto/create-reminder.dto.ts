import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateReminderDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsDateString()
  dueDate: Date;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  flag?: boolean;
}