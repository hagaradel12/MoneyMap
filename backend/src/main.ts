import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS BEFORE listening
  app.enableCors({
    origin: 'http://localhost:3001',  // Frontend origin
    credentials: true,                // Include if you're using cookies or auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  await app.listen(process.env.PORT ?? 3000);

  const appService = app.get(AppService);
  console.log('Mongo URI:', appService.getMongoUri());
  console.log('Database Name:', appService.getDatabaseName());
  console.log('Application is running on http://localhost:3000');
}
bootstrap();
