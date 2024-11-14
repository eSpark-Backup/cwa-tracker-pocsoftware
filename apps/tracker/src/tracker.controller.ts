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
import { ApiBearerAuth } from '@nestjs/swagger';
@ApiBearerAuth('jwt')
@Controller('devices')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createDevice(@Body() device: CreateDeviceDto, @Req() req: any) {
    return this.trackerService.createDevice(device);
  }
  @Post('tracker')
  @UseGuards(JwtAuthGuard)
  async updateLocation(@Body() location: DeviceLocationDto, @Req() req: any) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Split to
    console.log(req.user);
    return this.trackerService.updateLocation(location, token);
  }

  @Get()
  async getDevices() {
    return this.trackerService.getDevices();
  }
}
