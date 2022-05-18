import { PartialType, PickType } from '@nestjs/swagger'
import { UserEntity } from '../entities/user.entity'

export class UserUpdateInputDto extends PartialType(
  PickType(UserEntity, ['password', 'nickname']),
) {}
