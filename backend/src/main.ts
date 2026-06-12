import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // All routes are served under /api (e.g. POST /api/auth/login).
  app.setGlobalPrefix('api');

  // Allow the Next.js frontend to call the API. In dev the frontend port can
  // shift (3000 -> 3001 -> 3002 ...) when ports are taken, so accept any
  // localhost origin alongside the explicitly configured FRONTEND_URL.
  const allowedOrigin = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  app.enableCors({
    origin: (origin, callback) => {
      const ok =
        !origin || // non-browser clients (curl, server-side) send no Origin
        origin === allowedOrigin ||
        /^http:\/\/localhost:\d+$/.test(origin);
      callback(null, ok);
    },
    credentials: true,
  });

  // Validate incoming DTOs and strip properties that aren't whitelisted.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
