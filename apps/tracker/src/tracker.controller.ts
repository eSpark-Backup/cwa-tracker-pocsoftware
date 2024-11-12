/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { CreateDeviceDto } from './dto/create.device.dto';
import { DeviceLocationDto } from './dto/device.location.dto';
import { JwtAuthGuard } from '@app/common';

@Controller('devices')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createDevice(@Body() request: CreateDeviceDto) {
    return this.trackerService.createDevice(request);
  }
  @Post('tracker')
  @UseGuards(JwtAuthGuard)
  async updateLocation(@Body() location: DeviceLocationDto, @Req() req: any) {
    console.log(req.user);
    return this.trackerService.updateLocation(
      location,
      req.cookies?.Authentication,
    );
  }

  @Get()
  async getDevices() {
    return this.trackerService.getDevices();
  }
}
