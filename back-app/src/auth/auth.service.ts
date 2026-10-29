import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { authConfig } from '../config/auth.config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
  ) {}

  validate(username: string, password: string): string {
    // Without configured credentials nobody can sign in, not even with empty ones.
    if (
      !this.config.username ||
      !this.config.password ||
      username !== this.config.username ||
      password !== this.config.password
    ) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    return username;
  }
}
