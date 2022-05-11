import {
  PaginationInputDto,
  PaginationOutputDto,
} from '../../common/dtos/pagination.dto'
import { IsOptional } from 'class-validator'
import { LikeEntity } from '../entities/like.entity'

export class LikeListInputDto extends PaginationInputDto {}

export class LikeListOutputDto extends PaginationOutputDto {
  @IsOptional()
  likes?: LikeEntity[]
}
