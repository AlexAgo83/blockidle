import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: (origin, cb) => {
        const allowed = new Set([
          'https://block-idle.onrender.com',
          'https://blockidle-backend.onrender.com'
        ]);
        if (!origin) return cb(null, true);
        try {
          const { hostname } = new URL(origin);
          if (allowed.has(origin) || hostname === 'localhost' || hostname === '127.0.0.1') {
            return cb(null, true);
          }
          return cb(new Error('Not allowed by CORS'), false);
        } catch {
          return cb(new Error('Not allowed by CORS'), false);
        }
      },
      methods: ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'X-API-Key'],
      credentials: false
    }
  });

  app.use(json({ limit: '1mb' }));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const distPath = path.join(__dirname, '..', 'dist');

  app.useStaticAssets(distPath);

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);
  expressApp.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Nest API listening on port ${port}`);
}

bootstrap();
