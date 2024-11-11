/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class DeviceLocationDto {
  @ApiProperty({
    example: 'Device Name',
    description: 'Name of the Device',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  deviceName: string;

  @ApiProperty({
    example: '12345',
    description: 'ID of the Device',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  deviceId: string;

  @ApiProperty({
    example: { longitude: '3124', latitude: '13123' },
    description: 'Location of the device as a JSON object',
    required: true,
    type: Object,
  })
  @IsNotEmpty()
  @IsObject()
  location: Record<string, any>;
}
