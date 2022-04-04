import { PickType } from '@nestjs/swagger'
import { UserEntity } from '../entities/user.entity'

export class UserLoginInputDto extends PickType(UserEntity, [
  'email',
  'password',
]) {}
