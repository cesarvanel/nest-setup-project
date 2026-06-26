import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  username: process.env.AUTH_USERNAME ?? '',
  password: process.env.AUTH_PASSWORD ?? '',
}));
