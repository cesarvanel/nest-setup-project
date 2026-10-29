import { DynamicModule, Module } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { AuthenticationModule } from '@nestjs/authentication';
import { appConfig } from '@/config/app.config';
import { authConfig } from '@/config/auth.config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SessionAuth } from './providers/session-auth.provider';

@Module({})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        AuthenticationModule.forRootAsync({
          useFactory: (
            app: ConfigType<typeof appConfig>,
            auth: ConfigType<typeof authConfig>,
          ) => ({
            session: {
              cookieName: app.isProdMode
                ? `__Host-${auth.sessionCookieName}`
                : auth.sessionCookieName,
              absoluteTtl: auth.sessionTtl,
              idleTtl: 0,
              cookie: { secure: app.isProdMode },
              trustedOrigins: auth.trustedOrigins,
            },
            allowInMemoryStorage: true,
          }),
          inject: [appConfig.KEY, authConfig.KEY],
        }),
      ],
      providers: [AuthService, SessionAuth],
      controllers: [AuthController],
    };
  }
}
