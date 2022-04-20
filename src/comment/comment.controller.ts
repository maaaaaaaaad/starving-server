import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CommentService } from './comment.service'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { CommentRegisterInputDto } from './dtos/comment.register.dto'
import { User } from '../common/decorators/user.decorator'
import { UserEntity } from '../auth/entities/user.entity'

@UseGuards(JwtAuthGuard)
@Controller('comment')
@ApiTags('comment')
@ApiBearerAuth('access-token')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: 'Comment register' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: CommentRegisterInputDto })
  async register(
    @User() owner: UserEntity,
    @Body() commentRegisterInputDto: CommentRegisterInputDto,
  ) {
    return await this.commentService.register(owner, commentRegisterInputDto)
  }
}
