import { Controller, Get } from '@nestjs/common';
import { Authenticate, CurrentUser, Public } from '@nestjs/authentication';
import type { AuthUser } from '@/auth/authentication.types';

@Controller()
export class AppController {
  @Public()
  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Authenticate({ optional: true })
  @Get('session')
  session(@CurrentUser() user: AuthUser | null): { userId: string | null } {
    return { userId: user?.id ?? null };
  }
}
