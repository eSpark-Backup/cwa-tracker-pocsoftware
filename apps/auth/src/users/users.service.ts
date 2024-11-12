/* eslint-disable prettier/prettier */
import { User } from '@app/common';
import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create.user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async createUser(request: CreateUserDto) {
    await this.validateCreateUserRequest(request);
    const user = await this.usersRepo.save({
      name: request.name,
      email: request.email,
      role: 'user',
      password: await bcrypt.hash(request.password, 10),
    });
    return user;
  }

  private async validateCreateUserRequest(request: CreateUserDto) {
    let user: User;
    try {
      user = await this.usersRepo.findOne({
        where: { email: request.email },
      });
    } catch (err) {}

    if (user) {
      throw new UnprocessableEntityException('Email already exists');
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  async getUser(getUserArgs: any) {
    return this.usersRepo.findOne(getUserArgs);
  }
}
