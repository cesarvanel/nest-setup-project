import { Injectable } from '@nestjs/common';
import {
  AuthenticationRegistry,
  SessionCookieProvider,
} from '@nestjs/authentication';
import type { SessionRecord } from '@nestjs/authentication';
import type { AuthUser } from '../authentication.types';

@Injectable()
export class SessionAuth extends SessionCookieProvider<AuthUser> {
  constructor(registry: AuthenticationRegistry) {
    super();
    registry.registerProvider(this);
  }

  validate(session: SessionRecord): AuthUser {
    return { id: session.userId };
  }
}
