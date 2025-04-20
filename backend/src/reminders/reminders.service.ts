import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reminder, ReminderDocument } from './reminders.schema';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(
    @InjectModel(Reminder.name) private reminderModel: Model<ReminderDocument>,
  ) {}

  async create(createReminderDto: CreateReminderDto): Promise<Reminder> {
    const createdReminder = new this.reminderModel(createReminderDto);
    return createdReminder.save();
  }

  async findAll(flag?: boolean): Promise<Reminder[]> {
    const query: any = { deleted: false };
    if (flag !== undefined) {
      query.flag = flag;
    }
    return this.reminderModel.find(query).exec();
  }

  async findOne(id: string): Promise<Reminder> {
    return this.reminderModel.findOne({ _id: id, deleted: false }).exec();
  }

  async update(id: string, updateReminderDto: UpdateReminderDto): Promise<Reminder> {
    return this.reminderModel.findByIdAndUpdate(id, updateReminderDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Reminder> {
    // Soft delete implementation
    return this.reminderModel.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true },
    ).exec();
  }
}