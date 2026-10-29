import { NestFactory } from '@nestjs/core';
import { NodeAdapter } from '@nestjs/platform-node';
import type { NestNodeApplication } from '@nestjs/platform-node';
import { ConfigType } from '@nestjs/config';
import compression from 'compression';
import { AppModule } from '@/app.module';
import { appConfig } from '@/config/app.config';
import { authConfig } from '@/config/auth.config';
import { SwaggerBootstrap } from '@bootstrap/swagger.bootstrap';

class Application {
  private app: NestNodeApplication;

  static async create(): Promise<Application> {
    const instance = new Application();
    instance.app = await NestFactory.create<NestNodeApplication>(
      AppModule.forRoot(),
      new NodeAdapter(),
    );
    return instance;
  }

  configure(): this {
    this.configureSecurity();
    this.configureMiddleware();
    new SwaggerBootstrap(this.app).configure();

    this.app.setGlobalPrefix('api');

    return this;
  }

  private configureSecurity(): void {
    const { trustedOrigins } = this.app.get<ConfigType<typeof authConfig>>(
      authConfig.KEY,
    );
    this.app.enableCsrfProtection({ trustedOrigins });
  }

  private configureMiddleware(): void {
    this.app.use(compression());
  }

  async listen(): Promise<void> {
    const { port } = this.app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
    await this.app.listen(port);
  }
}

Application.create().then((app) => app.configure().listen());
