import { NestFactory } from '@nestjs/core';
import morgan from 'morgan';

import { AppModule } from './app.module';

async function bootstrap() {
  const { PORT = 3000 } = process.env;

  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'));

  await app.listen(PORT);

  console.log(`Listening on the port ${PORT}`);
}

bootstrap();
