import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RemindersService } from './reminders.service';
import { Reminder } from './reminders.schema';

describe('RemindersService', () => {
  let service: RemindersService;
  let model: Model<Reminder>;

  const mockReminder = {
    name: 'Test Reminder',
    dueDate: new Date(),
    flag: false,
    deleted: false,
    save: jest.fn(),
  };

  const mockReminderModel = {
    new: jest.fn().mockResolvedValue(mockReminder),
    constructor: jest.fn().mockResolvedValue(mockReminder),
    find: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemindersService,
        {
          provide: getModelToken(Reminder.name),
          useValue: mockReminderModel,
        },
      ],
    }).compile();

    service = module.get<RemindersService>(RemindersService);
    model = module.get<Model<Reminder>>(getModelToken(Reminder.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a reminder', async () => {
      const createReminderDto = {
        name: 'Test Reminder',
        dueDate: new Date(),
        flag: false,
      };
      
      jest.spyOn(model.prototype, 'save').mockResolvedValue(mockReminder);
      
      const result = await service.create(createReminderDto);
      expect(result).toEqual(mockReminder);
    });
  });

  // Add similar tests for other service methods
});