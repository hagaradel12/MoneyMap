import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  const appService = app.get(AppService);
  console.log('Mongo URI:', appService.getMongoUri());
  console.log('Database Name:', appService.getDatabaseName());
  app.enableCors({
    origin: 'http://localhost:3001',  // Ensure this is the correct frontend URL
    methods: ['GET', 'POST'],
  });

 // await app.listen(3000);
  console.log('Application is running on http://localhost:3000');
}
bootstrap();
