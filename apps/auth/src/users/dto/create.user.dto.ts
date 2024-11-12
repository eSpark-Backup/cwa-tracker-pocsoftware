/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'User Name',
    description: 'Name of the User',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'user@mail.com',
    description: 'Emaail of the SUer',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Password of the User',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
