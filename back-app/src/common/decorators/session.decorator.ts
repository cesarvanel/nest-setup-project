import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { SessionData } from 'express-session';

export const CurrentSession = createParamDecorator(
  (key: keyof SessionData | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return key ? req.session[key] : req.session;
  },
);
