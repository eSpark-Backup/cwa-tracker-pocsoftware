/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    RmqModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        COCKROACHDB_URI: Joi.string().required(),
        RMQ_URI: Joi.string().required(),
        RMQ_LOCATION_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/location/.env',
    }),
  ],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
