/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Headers,
  UseGuards,
  Res,
} from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { CreateDeviceDto } from './dto/create.device.dto';
import { DeviceLocationDto } from './dto/device.location.dto';
import { JwtAuthGuard } from '@app/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OnConnectionClosed } from './utils/decorators/on-connection-closed.decorator';
import { Observable } from 'rxjs';
import { Response, Request } from 'express';
import { LinkDeviceDto } from './dto/link.device.dto';

@ApiBearerAuth('jwt')
@Controller('devices')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  private activateDeviceStreams: Response[] = [];

  @Get('/activateStream')
  async streamData(
    @Headers('mac-address') macAddress: string,
    @Req() req: Request,
    @Res() res: Response,
    @OnConnectionClosed() connectionClosed$: Observable<void>,
  ) {
    if (!macAddress) {
      res.status(400).json({
        status: 400,
        message: 'MAC address is required in headers',
        data: null,
      });
      return;
    }

    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    (res as any).macAddress = macAddress;

    this.activateDeviceStreams.push(res);

    // Handle client disconnect
    connectionClosed$.subscribe({
      complete: () => {
        this.activateDeviceStreams = this.activateDeviceStreams.filter(
          (stream) => stream !== res,
        );
        res.end();
      },
    });
  }

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
    return this.trackerService.updateLocation(location, token);
  }

  @Post('linkDevice')
  @UseGuards(JwtAuthGuard)
  async linkDevice(@Body() linkDeviceDto: LinkDeviceDto, @Req() req: any) {
    return this.trackerService.linkDevice(
      linkDeviceDto,
      this.activateDeviceStreams,
      req.user,
    );
  }

  @Get()
  async getDevices() {
    return this.trackerService.getDevices();
  }
}
