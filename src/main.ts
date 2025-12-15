import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(cookieParser());
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());

  const documentConfig = new DocumentBuilder()
    .setTitle('Users Tasks API')
    .setDescription('Users Tasks API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(config.get('api.port') ?? 3000);
}
bootstrap();
