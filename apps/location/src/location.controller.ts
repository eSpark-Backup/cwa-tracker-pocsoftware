/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { LocationService } from './location.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class LocationController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly locationService: LocationService,
  ) {}

  @Get()
  getHello(): string {
    return this.locationService.getHello();
  }

  @EventPattern('device_location')
  async handleLocation(@Payload() data: any, @Ctx() context: RmqContext) {
    this.locationService.updateLocation(data);
    this.rmqService.ack(context);
  }
}
