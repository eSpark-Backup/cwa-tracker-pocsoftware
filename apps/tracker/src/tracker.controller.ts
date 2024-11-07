/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { TrackerService } from './tracker.service';

@Controller()
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Get()
  getHello(): string {
    return this.trackerService.getHello();
  }
}
