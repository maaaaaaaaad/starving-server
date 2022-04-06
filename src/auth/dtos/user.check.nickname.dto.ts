import { PickType } from '@nestjs/swagger'
import { UserEntity } from '../entities/user.entity'

export class UserCheckNicknameInputDto extends PickType(UserEntity, [
  'nickname',
]) {}
