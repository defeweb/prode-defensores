import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.setGlobalPrefix('v1');

  await app.listen(process.env.PORT || 3001);
  console.log('Backend corriendo en http://localhost:3001/v1');
}
bootstrap();
