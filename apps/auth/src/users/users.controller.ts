/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { JwtAuthGuard, User } from '@app/common';
import { CurrentUser } from '../current-user.decorator';
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { VerifyTokenDto } from './dto/verifiy.token.dto';

@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() request: CreateUserDto) {
    return this.usersService.createUser(request);
  }

  @UseGuards(JwtAuthGuard)
  @Post('generate-qr')
  @ApiBearerAuth('jwt')
  async generateQr(@Req() req: any) {
    return this.usersService.generateQr(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-token')
  @ApiBearerAuth('jwt')
  async verifyToken(@Req() req: any, @Body() verifyToken: VerifyTokenDto) {
    return this.usersService.verifyToken(req.user, verifyToken.token);
  }
}
