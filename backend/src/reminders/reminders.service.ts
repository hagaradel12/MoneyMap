import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reminder, ReminderDocument } from './reminders.schema';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import * as dayjs from 'dayjs';
import { UserDocument } from 'src/user/user.schema';


@Injectable()
export class RemindersService {
  constructor(
    @InjectModel(Reminder.name) private reminderModel: Model<ReminderDocument>,
     @InjectModel('Users') private readonly userModel: Model<UserDocument>,
  ) {}

async createForUser(email: string, dto: CreateReminderDto): Promise<Reminder> {
  const reminder = new this.reminderModel(dto);
  const savedReminder = await reminder.save();

  const user = await this.userModel.findOneAndUpdate(
    { email },
    { $push: { reminders: savedReminder._id } },
    { new: true }
  );

  if (!user) throw new Error(`User with email ${email} not found`);
  return savedReminder;
}

async findAll(flag?: boolean): Promise<Reminder[]> {
  await this.cleanOldReadReminders();
  const query: any = { deleted: false };
  if (flag !== undefined) query.flag = flag;
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

   async cleanOldReadReminders(): Promise<void> {
    const oneWeekAgo = dayjs().subtract(7, 'days').toDate();
    await this.reminderModel.deleteMany({
      read: true,
      updatedAt: { $lt: oneWeekAgo },
    }).exec();
  }

  async markAsRead(id: string): Promise<Reminder> {
  return this.reminderModel.findByIdAndUpdate(id, { read: true }, { new: true }).exec();
}
async findByUserEmail(email: string): Promise<Reminder[]> {
  const user = await this.userModel.findOne({ email }).populate<{ reminders: Reminder[] }>('reminders').exec();
  if (!user) throw new Error(`User with email ${email} not found`);

  return user.reminders;
}

}