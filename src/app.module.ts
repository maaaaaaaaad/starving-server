import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from 'joi'
import * as ormconfig from './typeorm.config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppLoggerMiddleware } from './common/middlewares/logger.middleware'
import { AuthModule } from './auth/auth.module'
import { UploadModule } from './upload/upload.module'
import { RecipeModule } from './recipe/recipe.module'
import { CommentModule } from './comment/comment.module'
import { LikeModule } from './like/like.module'
import { ThrottlerModule } from '@nestjs/throttler'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? '.development.env'
          : '.production.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        JWT_SECRET_KEY: Joi.string().required(),
        THROTTLER_TTL: Joi.number().required(),
        THROTTLER_LIMIT: Joi.number().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        SWAGGER_USER: Joi.string().required(),
        SWAGGER_PASSWORD: Joi.string().required(),
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>('THROTTLER_TTL'),
        limit: configService.get<number>('THROTTLER_LIMIT'),
      }),
    }),
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    UploadModule,
    RecipeModule,
    CommentModule,
    LikeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*')
  }
}
