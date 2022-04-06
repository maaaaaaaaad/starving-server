import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter'
import { UndefinedInterceptor } from './common/interceptors/undefined.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = process.env.PORT
  app.setGlobalPrefix('api')
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new UndefinedInterceptor())

  const config = new DocumentBuilder()
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .setTitle('STARVING')
    .setDescription('STARVING API description')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.enableCors()
  await app.listen(port, () => console.log(`Start server port ${port}`))
}
bootstrap()
