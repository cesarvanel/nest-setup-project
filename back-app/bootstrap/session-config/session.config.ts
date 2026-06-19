import { ConfigService } from '@nestjs/config';
import { SessionOptions } from 'express-session';
import './session.types';

export class SessionConfig {
  constructor(
    private readonly config: ConfigService,
    private readonly isProdMode: boolean,
  ) {}

  build(): SessionOptions {
    return {
      name: this.config.getOrThrow<string>('SESSION_COOKIE_NAME'),
      secret: this.config.getOrThrow<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: this.isProdMode,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 5,
      },
    };
  }
}
