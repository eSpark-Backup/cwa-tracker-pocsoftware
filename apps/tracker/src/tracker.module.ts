/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TrackerController } from './tracker.controller';
import { TrackerService } from './tracker.service';
import {
  AuthModule,
  DatabaseModule,
  Device,
  DeviceUser,
  GlobalExceptionFilter,
  RmqModule,
  SuccessResponseInterceptor,
  User,
} from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LOCATION_SERVICE } from './constants/services';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core/constants';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        COCKROACHDB_URI: Joi.string().required(),
      }),
      envFilePath: './apps/tracker/.env',
    }),
    TypeOrmModule.forFeature([Device, User, DeviceUser]),
    RmqModule.register({ name: LOCATION_SERVICE }),
    AuthModule,
  ],
  controllers: [TrackerController],
  providers: [
    TrackerService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessResponseInterceptor,
    },
  ],
})
export class TrackerModule {}
