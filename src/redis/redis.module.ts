import { CacheModule, Module } from '@nestjs/common'
import { RedisService } from './redis.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as redisStore from 'cache-manager-ioredis'

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
