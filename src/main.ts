import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session'; // Import session directly from 'express-session'
import connectPgSimple from 'connect-pg-simple';
import { ConfigService } from '@nestjs/config';
import passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const pgSession = connectPgSimple(session);
  const configService = app.get<ConfigService>(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [configService.get('FRONT_URL')],
    credentials: true,
  });
  app.set('trust proxy', 1);
  app.use(
    session({
      store: new pgSession({
        conString: configService.get('DATABASE_URL'),
        tableName: 'sessions',
      }),
      secret: configService.get('SECRET_SESSION'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(configService.get('PORT'));
}
bootstrap();
