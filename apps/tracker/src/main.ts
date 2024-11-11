/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { TrackerModule } from './tracker.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(TrackerModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  app.enableCors();
  // This is the Swagger configuration that we will use later for the API documentation
  const config = new DocumentBuilder()
    .setTitle('CWA Tracker Software')
    .setDescription('The CWA Tracker API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(configService.get('PORT'));
}
bootstrap();
