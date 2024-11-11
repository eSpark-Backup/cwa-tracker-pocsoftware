/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { CreateDeviceDto } from './dto/create.device.dto';
import { DeviceLocationDto } from './dto/device.location.dto';

@Controller('devices')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Post()
  async createDevice(@Body() request: CreateDeviceDto) {
    return this.trackerService.createDevice(request);
  }
  @Post('tracker')
  async updateLocation(@Body() location: DeviceLocationDto) {
    return this.trackerService.updateLocation(location);
  }

  @Get()
  async getDevices() {
    return this.trackerService.getDevices();
  }
}
