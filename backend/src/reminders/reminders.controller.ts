import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { Reminder } from './reminders.schema';
import { Users } from 'src/user/user.schema';


@Controller('reminders')
export class RemindersController {

  constructor(private readonly remindersService: RemindersService) {}

@Post('user/:email')
createReminderForUser(
  @Param('email') email: string,
  @Body() dto: CreateReminderDto
) {
  return this.remindersService.createForUser(email, dto);
}
@Get('user/:email/reminders')
getUserReminders(@Param('email') email: string) {
  return this.remindersService.findByUserEmail(email);
}

  @Get()
  findAll(@Query('flag') flag?: boolean) {
    return this.remindersService.findAll(flag);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.remindersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReminderDto: UpdateReminderDto) {
    return this.remindersService.update(id, updateReminderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.remindersService.remove(id);
  }
  @Patch('read/:id')
markAsRead(@Param('id') id: string) {
  return this.remindersService.markAsRead(id);
}



}