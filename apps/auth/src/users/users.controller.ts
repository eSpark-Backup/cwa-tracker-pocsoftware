/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';

@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() request: CreateUserDto) {
    return this.usersService.createUser(request);
  }
}
