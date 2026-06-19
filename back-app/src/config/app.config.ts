import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '4500', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isMaintenance: process.env.MAINTENANCE === 'true',
  isDevMode:process.env.NODE_ENV ==="development",
  isProdMode:process.env.NODE_ENV ==="production",
}));
