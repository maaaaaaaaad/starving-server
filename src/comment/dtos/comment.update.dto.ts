import { BaseOutputDto } from '../../common/dtos/base.output.dto'
import { PickType } from '@nestjs/swagger'
import { CommentEntity } from '../entities/comment.entity'

export class CommentUpdateInputDto extends PickType(CommentEntity, [
  'pk',
  'content',
]) {}
export class CommentUpdateOutputDto extends BaseOutputDto {}
