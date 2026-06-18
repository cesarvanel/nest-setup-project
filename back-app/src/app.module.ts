import { DynamicModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { CsrfService } from '@/csrf/csrf.service';
import { AuthModule } from '@/auth/auth.module';
import { ProfileModule } from '@/profile/profile.module';
import { AuthMiddleware } from '@/middleware/auth.middleware';
import { appConfig } from '@/config/app.config';
import { authConfig } from '@/config/auth.config';
import { ReactSpaModule } from '@bootstrap/spa-config/serve-static.module';

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }

  static forRoot(): DynamicModule {
    return {
      module: AppModule,
      providers: [AppService, CsrfService],
      controllers: [AppController],
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [appConfig, authConfig] }),
        AuthModule.forRoot(),
        ProfileModule,
        ReactSpaModule.forRoot(),
      ],
    };
  }
}
