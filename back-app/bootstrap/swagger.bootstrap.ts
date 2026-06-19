import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigType } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { appConfig } from '@/config/app.config';

export class SwaggerBootstrap {
  constructor(private readonly app: NestExpressApplication) {}

  configure(): void {
    const { isProdMode } = this.app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
    if (isProdMode) return;

    const config = new DocumentBuilder()
      .setTitle('Nest Setup Example')
      .setDescription('The nest-setup API description')
      .setVersion('1.0')
      .addTag('nest-setup')
      .build();

    SwaggerModule.setup(
      'api-docs',
      this.app,
      () => SwaggerModule.createDocument(this.app, config),
    );
  }
}
