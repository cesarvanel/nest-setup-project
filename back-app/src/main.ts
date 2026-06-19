import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from '@nestjs/config';
import { AppModule } from '@/app.module';
import { CsrfService } from '@/csrf/csrf.service';
import { appConfig } from '@/config/app.config';
import { MiddlewareBootstrap } from '@bootstrap/middleware.bootstrap';
import { SessionBootstrap } from '@bootstrap/session.bootstrap';
import { SwaggerBootstrap } from '@bootstrap/swagger.bootstrap';

class Application {
  private app: NestExpressApplication;
  private config: ConfigService;

  static async create(): Promise<Application> {
    const instance = new Application();
    instance.app = await NestFactory.create<NestExpressApplication>(AppModule.forRoot());
    instance.config = instance.app.get(ConfigService);
    return instance;
  }

  configure(): this {
    new MiddlewareBootstrap(this.app, this.config).configure();

    const session = new SessionBootstrap(this.app, this.config);
    session.configure();
    this.app.get(CsrfService).init(session.generateCsrfToken);

    new SwaggerBootstrap(this.app).configure();

    this.app.setGlobalPrefix('api');

    return this;
  }

  async listen(): Promise<void> {
    const { port } = this.app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
    await this.app.listen(port);
  }
}

Application.create()
  .then((app) => app.configure().listen());
