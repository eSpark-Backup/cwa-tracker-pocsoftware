/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

export const OnConnectionClosed = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) =>
    new Observable((observer) => {
      const request = ctx.switchToHttp().getRequest<Request>();

      request.on('close', () => observer.complete());
    }),
);
