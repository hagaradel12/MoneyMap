import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private mongoUri = 'mongodb+srv://janaali1804:VUPciUD34CDNFXKK@cluster0.zssowqd.mongodb.net/';
  private databaseName = 'Moneymap';
  getHello(): string {
    return 'Hello World!';
  }

  getMongoUri(): string {
    return this.mongoUri;
 }

  getDatabaseName(): string {
    return this.databaseName;
  }
}