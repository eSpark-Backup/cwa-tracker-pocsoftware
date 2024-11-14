/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prettier/prettier */
import { User } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

export interface TokenPayload {
  userId: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User) {
    const tokenPayload: TokenPayload = {
      userId: user.id.toString(),
      email: user.email,
    };

    const token = this.jwtService.sign(tokenPayload);

    return { access_token: token };
  }
}
