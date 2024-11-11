/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { LocationModule } from './location.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(LocationModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('LOCATION'));
  await app.startAllMicroservices();
}
bootstrap();
