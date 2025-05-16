import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { ResponseInterceptor } from './common/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 跨域请求
  app.enableCors();
  // 全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 全局异常处理
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('选举投票系统 API')
    .setDescription('选举投票系统的API文档')
    .setVersion('1.0')
    .addTag('选举投票')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.setGlobalPrefix('api');

  const PORT = process.env.PORT || 8888;

  await app.listen(PORT, '0.0.0.0');
  console.log(`* Running on http://127.0.0.1:${PORT}`);
  console.log(`* Running on http://127.0.0.1:${PORT}/docs`);
  console.log('* 启动成功');
}
bootstrap();
