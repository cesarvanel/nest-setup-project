import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

const PUBLIC_ROUTES: Array<{ path: RegExp; method: string }> = [
  { path: /^\/api\/health$/,       method: 'GET'  },
  { path: /^\/api\/session$/,      method: 'GET'  },
  { path: /^\/api\/auth\/login$/,  method: 'POST' },
  { path: /^\/api\/auth\/logout$/, method: 'POST' },
];


@Injectable()
export class AuthMiddleware implements NestMiddleware {

  use(req: Request, _res: Response, next: NextFunction): void {

    const currentPath = req.originalUrl.split('?')[0];

    const isPublic = PUBLIC_ROUTES.some(
      ({ path, method }) => path.test(currentPath) && method === req.method,
    );

    if (isPublic) return next();

    if (!req.session?.userId) {
      throw new UnauthorizedException('Non authentifié');
    }

    next();
  }
}
