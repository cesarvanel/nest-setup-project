import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import type { ServeStaticModuleOptions } from '@nestjs/serve-static';
import type { ConfigType } from '@nestjs/config';
import { join } from 'path';
import { appConfig } from '@/config/app.config';

const PUBLIC_DIR = join(__dirname, '..', '..', 'public');

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      useFactory: ({
        isProdMode,
        isMaintenance,
      }: ConfigType<typeof appConfig>): ServeStaticModuleOptions[] => {
        if (!isProdMode && !isMaintenance) return [];

        return [
          {
            rootPath: join(PUBLIC_DIR, isMaintenance ? 'maintenance' : 'build'),
            exclude: ['/api/{*path}'],
          },
        ];
      },
      inject: [appConfig.KEY],
    }),
  ],
})
export class ReactSpaModule {}
