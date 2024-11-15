/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LinkDeviceDto {
  @ApiProperty({
    example: '00:00:00:00:00:00',
    description: 'MAC Address of the Device',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  macAddress: string;

  @ApiProperty({
    example: '1234',
    description: 'Secret code of the Device',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  code: string;
}
