import { PickType } from '@nestjs/swagger'
import { UserEntity } from '../entities/user.entity'

export class UserRegisterInputDto extends PickType(UserEntity, [
  'email',
  'password',
  'nickname',
  'avatarImage',
  'social',
]) {}
