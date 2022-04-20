import {
  PaginationInputDto,
  PaginationOutputDto,
} from '../../common/dtos/pagination.dto'
import { IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { CommentEntity } from '../entities/comment.entity'

export class CommentGetInputDto extends PaginationInputDto {
  @IsNumber()
  @ApiProperty({
    description: 'Recipe primary key',
    type: Number,
    nullable: false,
    required: true,
  })
  recipePk: number
}

export class CommentGetOutputDto extends PaginationOutputDto {
  comments?: CommentEntity[]
}
