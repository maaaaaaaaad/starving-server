import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { Cache } from 'cache-manager'
import { UserEntity } from '../auth/entities/user.entity'

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async currentUser(user: UserEntity) {
    const cacheUser = await this.cacheManager.get('user')
    if (cacheUser) {
      return {
        cache: true,
        message: 'delivery cache user',
        user: cacheUser,
      }
    }
    try {
      await this.cacheManager.set('user', user, { ttl: 30 })
      return {
        cache: false,
        message: 'set in memory user',
        user,
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }
}
