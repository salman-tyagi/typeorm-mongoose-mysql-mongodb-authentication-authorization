import { NestFactory } from '@nestjs/core';
import morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const { PORT = 3000 } = process.env;

  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );

  await app.listen(PORT);

  console.log(`Listening on the port ${PORT}`);
}

bootstrap();
