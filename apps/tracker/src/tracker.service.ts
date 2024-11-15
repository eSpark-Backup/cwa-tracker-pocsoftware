/* eslint-disable prettier/prettier */
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateDeviceDto } from './dto/create.device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Device, DeviceUser, User } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { DeviceLocationDto } from './dto/device.location.dto';
import { lastValueFrom } from 'rxjs';
import { LOCATION_SERVICE } from './constants/services';
import { LinkDeviceDto } from './dto/link.device.dto';
import { stat } from 'fs';

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

  async linkDevice(
    linkDeviceDto: LinkDeviceDto,
    activateDeviceStreams: any,
    user: User,
  ) {
    try {
      const matchingStreams = activateDeviceStreams.filter(
        (stream: any) => stream.macAddress === linkDeviceDto.macAddress,
      );

      if (matchingStreams.length === 0) {
        return {
          status: 404,
          message: `No active stream found for MAC address ${linkDeviceDto.macAddress}`,
          data: null,
        };
      }
      await this.dataSource.transaction(async (manager) => {
        const existingDevice = await manager
          .createQueryBuilder(Device, 'device')
          .where('device.code = :code AND device.macAddress = :macAddress', {
            code: linkDeviceDto.code,
            macAddress: linkDeviceDto.macAddress,
          })
          .getOne();

        if (existingDevice) {
          const existingDeviceUser = await manager
            .createQueryBuilder(DeviceUser, 'deviceUser')
            .where('deviceUser.device = :deviceId', {
              deviceId: existingDevice.id,
            })
            .getOne();
          console.log(existingDeviceUser);

          if (existingDeviceUser) {
            throw new Error(
              `The device with ID ${existingDevice.id} is already registered to the user, please use another device or contact support`,
            );
          }

          await manager
            .createQueryBuilder(DeviceUser, 'deviceUser')
            .insert()
            .into(DeviceUser)
            .values({
              device: existingDevice,
              user,
            })
            .execute();
          const updatedDevice = await manager
            .createQueryBuilder()
            .update(Device)
            .set({ isOnBoard: true })
            .where('device.code = :code', { code: linkDeviceDto.code })
            .execute();
          const dataForStream = {
            userId: user.id,
            device: updatedDevice,
            email: user.email,
            password: user.password,
          };
          matchingStreams[0].write(
            `data: ${JSON.stringify(dataForStream)}\n\n`,
          );
        } else {
          return {
            status: false,
            data: null,
            message: 'Device does not exist',
          };
        }
      });
      return {
        status: true,
        message: 'Device linked successfully',
        data: null,
      };
    } catch (error) {
      return {
        data: null,
        status: false,
        message: error.message,
      };
    }
  }

  async updateLocation(
    deviceLocationDto: DeviceLocationDto,
    authentication: string,
  ) {
    try {
      await this.dataSource.transaction(async (manager) => {
        await lastValueFrom(
          this.locationClient.emit('device_location', {
            deviceLocationDto,
            Authentication: authentication,
          }),
        );
      });
      return {
        status: true,
        message: 'Location updated successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getDevices() {
    try {
      const devices = await this.dataSource.transaction(async (manager) => {
        return manager.createQueryBuilder(Device, 'device').getMany();
      });

      return {
        data: devices,
        message: 'Devices fetched successfully',
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  }
}
