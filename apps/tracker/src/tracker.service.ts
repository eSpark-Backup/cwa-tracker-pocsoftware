/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateDeviceDto } from './dto/create.device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Device } from '@app/common';
import { LOCATION_SERVICE } from './constants/servics';
import { ClientProxy } from '@nestjs/microservices';
import { DeviceLocationDto } from './dto/device.location.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TrackerService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
    private readonly dataSource: DataSource,
    @Inject(LOCATION_SERVICE) private readonly locationClient: ClientProxy,
  ) {}
  async createDevice(createDeviceDto: CreateDeviceDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const existingDevice = await manager
          .createQueryBuilder(Device, 'device')
          .where('device.code = :code OR device.macAddress = :macAddress', {
            code: createDeviceDto.code,
            macAddress: createDeviceDto.macAddress,
          })
          .getOne();

        if (existingDevice) {
          return {
            message: 'Device already exists',
          };
        }
        await manager
          .createQueryBuilder()
          .insert()
          .into(Device)
          .values({
            code: createDeviceDto.code,
            macAddress: createDeviceDto.macAddress,
            name: createDeviceDto.deviceName,
          })
          .execute();
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateLocation(deviceLocationDto: DeviceLocationDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        await lastValueFrom(
          this.locationClient.emit('device_location', deviceLocationDto),
        );
      });
      return deviceLocationDto;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getDevices() {
    try {
      return this.deviceRepository.find();
    } catch (error) {
      return error;
    }
  }
}
