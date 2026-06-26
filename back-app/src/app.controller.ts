import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { CsrfService } from '@/csrf/csrf.service';
import { CurrentSession } from '@/decorators/session.decorator';
import type { SessionData } from 'express-session';

@Controller()
export class AppController {
  constructor(
    private readonly csrfService: CsrfService,
    private readonly config: ConfigService,
  ) {}

  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Get('session')
  initSession(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @CurrentSession() session: SessionData,
  ): { userId: string | null } {
    if (!session.createdAt) {
      session.createdAt = new Date().toISOString();
    }
    const csrfToken = this.csrfService.generateToken(req, res, { overwrite: false });
    res.setHeader(this.config.getOrThrow<string>('COOKIE_NAME'), csrfToken);
    return { userId: session.userId ?? null };
  }
}
