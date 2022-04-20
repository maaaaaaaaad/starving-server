import { PickType } from '@nestjs/swagger'
import { CommentEntity } from '../entities/comment.entity'
import { BaseOutputDto } from '../../common/dtos/base.output.dto'

export class CommentDeleteInputDto extends PickType(CommentEntity, ['pk']) {}
export class CommentDeleteOutputDto extends BaseOutputDto {}
