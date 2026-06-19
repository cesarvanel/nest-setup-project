import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService, ConfigType } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { doubleCsrf, CsrfTokenGenerator, CsrfRequestValidator, DoubleCsrfUtilities } from 'csrf-csrf';
import { appConfig } from '@/config/app.config';
import { SessionConfig } from './session-config/session.config';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export class SessionBootstrap {
  readonly generateCsrfToken: CsrfTokenGenerator;
  private readonly validateRequest: CsrfRequestValidator;
  private readonly csrfError: DoubleCsrfUtilities['invalidCsrfTokenError'];
  private readonly isProdMode: boolean;

  constructor(
    private readonly app: NestExpressApplication,
    private readonly config: ConfigService,
  ) {
    const { isProdMode } = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
    this.isProdMode = isProdMode;

    const { generateCsrfToken, validateRequest, invalidCsrfTokenError } = doubleCsrf({
      getSecret: () => config.getOrThrow<string>('CSRF_SECRET'),
      getSessionIdentifier: (req) => req.session.id,
      cookieName: config.getOrThrow<string>('COOKIE_NAME'),
      cookieOptions: { secure: isProdMode, httpOnly: true, sameSite: 'lax' },
    });

    this.generateCsrfToken = generateCsrfToken;
    this.validateRequest = validateRequest;
    this.csrfError = invalidCsrfTokenError;
  }

  configure(): void {
    this.app.use(session(new SessionConfig(this.config, this.isProdMode).build()));

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (SAFE_METHODS.has(req.method)) {
        return next();
      }
      if (!this.validateRequest(req)) {
        res.status(403).json({ statusCode: 403, message: this.csrfError.message });
        return;
      }
      next();
    });
  }
}
