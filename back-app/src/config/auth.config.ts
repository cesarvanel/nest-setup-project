import { registerAs } from '@nestjs/config';
import type { Duration } from '@nestjs/authentication';

export const authConfig = registerAs('auth', () => ({
  username: process.env.AUTH_USERNAME ?? '',
  password: process.env.AUTH_PASSWORD ?? '',
  sessionCookieName: process.env.SESSION_COOKIE_NAME ?? 'SETUP-SID',
  sessionTtl: (process.env.SESSION_TTL ?? '5m') as Duration,
  trustedOrigins: (process.env.TRUSTED_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
}));
