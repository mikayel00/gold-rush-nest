import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';
import { swagger } from './swagger';

async function bootstrap(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('combined'));
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  const configService = app.select(SharedModule).get(ApiConfigService);

  const port = configService.appConfig.port;

  swagger(app);

  await app.listen(port);

  console.info(`Server running on ${await app.getUrl()}`);
  return app;
}
void bootstrap();
