import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter'
import { UndefinedInterceptor } from './common/interceptors/undefined.interceptor'
import * as path from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'
import helmet from 'helmet'
import * as winston from 'winston'
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('STARVING', {
              prettyPrint: true,
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'combined.log',
          level: 'info',
        }),
        new winston.transports.File({
          filename: 'errors.log',
          level: 'error',
        }),
      ],
    }),
  })
  app.enableCors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
  })
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
    }),
  )
  const port = process.env.PORT
  app.setGlobalPrefix('api')
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new UndefinedInterceptor())

  if (process.env.NODE_ENV !== 'production') {
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
  }

  app.useStaticAssets(path.join(__dirname, './common', 'files'), {
    prefix: '/media',
  })
  await app.listen(port, () => console.log(`Start server port ${port}`))
}
bootstrap()
