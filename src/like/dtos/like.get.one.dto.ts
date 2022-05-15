import { LikeRegisterInputDto } from './like.register.dto'
import { BaseOutputDto } from '../../common/dtos/base.output.dto'
import { IsOptional } from 'class-validator'
import { LikeEntity } from '../entities/like.entity'

export class LikeGetOneInputDto extends LikeRegisterInputDto {}
export class LikeGetOneOutputDto extends BaseOutputDto {
  @IsOptional()
  like?: LikeEntity
}
