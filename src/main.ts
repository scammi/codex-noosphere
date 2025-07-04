import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  app.setGlobalPrefix('api');
  app.use(json({ limit: '50mb' }));

  await app.listen(port);
  console.log(`🚀 Codex Noosphere API running on port ${port}`);
}

bootstrap();