import { Controller, Get, HttpCode, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { CsrfService } from '@/csrf/csrf.service';
import { CurrentSession } from '@/decorators/session.decorator';
import type { SessionData } from 'express-session';

@Controller()
export class AppController {
  constructor(private readonly csrfService: CsrfService) {}

  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Get('session')
  @HttpCode(204)
  initSession(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @CurrentSession() session: SessionData,
  ): void {
    if (!session.createdAt) {
      session.createdAt = new Date().toISOString();
    }
    const csrfToken = this.csrfService.generateToken(req, res, { overwrite: false });
    res.setHeader('X-CSRF-Token', csrfToken);
    if (session.userId) {
      res.setHeader('X-User-Id', session.userId);
    }
  }
}
