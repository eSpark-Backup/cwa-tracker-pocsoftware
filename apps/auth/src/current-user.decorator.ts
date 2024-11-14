/* eslint-disable prettier/prettier */
import { User } from '@app/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getCurrentUserByContext = (context: ExecutionContext): User => {
  const contextType = context.getType();
  if (contextType === 'http') {
    const user = context.switchToHttp().getRequest().user;
    return user;
  }
  if (contextType === 'rpc') {
    const user = context.switchToRpc().getData().user;
    return user;
  }
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
