import { PickType } from '@nestjs/swagger'
import { UserEntity } from '../entities/user.entity'

export class UserUpdateInputDto extends PickType(UserEntity, [
  'password',
  'nickname',
]) {}
