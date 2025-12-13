import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AppModule } from './app.module.js';

function buildAllowedOrigins() {
  const defaults = ['https://block-idle.onrender.com', 'https://blockidle-backend.onrender.com'];
  const extra = (process.env.CORS_ORIGINS || process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  return new Set([...defaults, ...extra]);
}

function isLocalOrigin(origin: string) {
  try {
    const { hostname } = new URL(origin);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

async function bootstrap() {
  const allowedOrigins = buildAllowedOrigins();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        try {
          if (allowedOrigins.has(origin) || isLocalOrigin(origin)) {
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

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);
  const distPath = path.join(__dirname, '..', '..', 'dist');
  if (fs.existsSync(distPath)) {
    app.useStaticAssets(distPath);
    expressApp.get(/.*/, (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    console.warn(`Static assets not found at ${distPath}, skipping frontend hosting.`);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Nest API listening on port ${port}`);
}

bootstrap();
