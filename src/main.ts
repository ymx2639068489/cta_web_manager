import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// 验证管道
import { ValidationPipe } from '@nestjs/common';
// 过滤器, 捕获异常
import { HttpExceptionFilter } from './common/filters';
// 全局拦截器
import {
  // 响应包装拦截器
  WrapResponseInterceptor,
} from './common/interceptors';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
async function bootstrap() {
  const appConfig = {
    cors: true,
    abortOnError: false,
  };
  const app = await NestFactory.create(AppModule, appConfig);
  app.setGlobalPrefix('api');
  const options = new DocumentBuilder()
    .setTitle('CTA_WEB_MANAGER_API_DOCUMENT')
    .setDescription('The CTA_WEB_API_DOCUMENT API description')
    .setVersion('1.1.2')
    .addBearerAuth()
    .addTag('CTA_WEB_MANAGER_API_DOCUMENT')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  // 全局验证器
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 删除掉不需要验证的参数
      forbidNonWhitelisted: true, // 格式不对就直接报错
      transform: true, // 允许转换参数类型
      transformOptions: {
        enableImplicitConversion: true, // 允许隐式转换
      },
    }),
  );

  // 过滤器捕获异常
  app.useGlobalFilters(new HttpExceptionFilter());

  // 全局拦截器
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    // new TimeoutInterceptor(),
  );
  // 限速
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 100,
    }),
  )
  // csrf保护
  // app.use(csurf());
  // Helmet 可以帮助保护应用免受一些众所周知的 Web 漏洞的影响
  app.use(helmet());
  await app.listen(3100);
  console.log(`Application manager development is running on: ${await app.getUrl()}`);
}
bootstrap();

/**
 * 3100 -> process
 * 3101 -> development
 * class-validator class-transformer // 参数转换和验证
 * @nestjs/typeorm typeorm mysql
 * @nestjs/config
 * @nestjs/swagger
 * express-rate-limit
 * helmet
 * @nestjs/passport
 * @nestjs/jwt
 * passport-local
 * stacktrace-js moment log4js node-rsa
 */
