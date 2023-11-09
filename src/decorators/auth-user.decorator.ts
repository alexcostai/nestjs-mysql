import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export function AuthUser() {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  })();
}
