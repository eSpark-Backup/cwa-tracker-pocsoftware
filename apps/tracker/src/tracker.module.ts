/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TrackerController } from './tracker.controller';
import { TrackerService } from './tracker.service';
import { DatabaseModule } from '@app/common';

@Module({
  imports: [DatabaseModule],
  controllers: [TrackerController],
  providers: [TrackerService],
})
export class TrackerModule {}
