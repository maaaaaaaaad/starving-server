import { ApiProperty, PickType } from '@nestjs/swagger'
import { CommentEntity } from '../entities/comment.entity'
import { BaseOutputDto } from '../../common/dtos/base.output.dto'
import { IsNumber } from 'class-validator'

export class CommentRegisterInputDto extends PickType(CommentEntity, [
  'content',
]) {
  @IsNumber()
  @ApiProperty({
    description: 'Recipe primary key',
    type: Number,
    nullable: false,
    required: true,
  })
  recipePk: number
}

export class CommentRegisterOutputDto extends BaseOutputDto {}
