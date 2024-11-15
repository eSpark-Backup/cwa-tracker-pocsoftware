/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class VerifyTokenDto {
  @ApiProperty({
    type: String,
    description: 'The token to verify',
  })
  token: string;
}
