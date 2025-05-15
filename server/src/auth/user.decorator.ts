import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const req: any = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
