/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TrackerController } from './tracker.controller';
import { TrackerService } from './tracker.service';
import { DatabaseModule, Device, RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LOCATION_SERVICE } from './constants/servics';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/tracker/.env',
    }),
    TypeOrmModule.forFeature([Device]),
    RmqModule.register({ name: LOCATION_SERVICE }),
  ],
  controllers: [TrackerController],
  providers: [TrackerService],
})
export class TrackerModule {}
