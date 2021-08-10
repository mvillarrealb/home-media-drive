import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as compression from 'compression';
import * as helmet from 'helmet';
import configuration from './configuration';
import { startSandbox } from './sandbox';

async function bootstrap() {
  if(process.env.SANDBOX_MODE) {
    const sandboxConfig =  await startSandbox();
    process.env.MEDIA_CENTER_SANDBOX_CONFIG = sandboxConfig;
  } 
  const { http } = configuration();
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(compression());
  app.use(helmet());
  await app.listen(http.port);
}
bootstrap();
