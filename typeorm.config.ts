/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
console.log(__dirname);
export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'cockroachdb',
  url: configService.get<string>('COCKROACHDB_URI'),
  ssl: true,
  entities: [__dirname + '/libs/common/src/database/entity/*.entity{.ts,.js}'],
  migrations: [
    __dirname + '/libs/common/src/database/entity/*.entity{.ts,.js}',
  ],
  synchronize: true,
  logging: true,
});
