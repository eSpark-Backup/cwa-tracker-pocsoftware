/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Device, BaseEntity } from '@app/common';
console.log(__dirname);
export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'cockroachdb',
  url: configService.get<string>('COCKROACHDB_URL'),
  ssl: true,
  entities: [Device, BaseEntity],
  migrations: [Device, BaseEntity],
  synchronize: true,
  logging: true,
});
