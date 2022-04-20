import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
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
import { CommentGetInputDto } from './dtos/comment.get.dto'
import { CommentUpdateInputDto } from './dtos/comment.update.dto'

@Controller('comment')
@ApiTags('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Comment register' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: CommentRegisterInputDto })
  async register(
    @User() owner: UserEntity,
    @Body() commentRegisterInputDto: CommentRegisterInputDto,
  ) {
    return await this.commentService.register(owner, commentRegisterInputDto)
  }

  @Get()
  @ApiOperation({ summary: 'Comment register' })
  @ApiConsumes('application/x-www-form-urlencoded')
  async get(@Query() commentGetInputDto: CommentGetInputDto) {
    return await this.commentService.get(commentGetInputDto)
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiBearerAuth('access-token')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Comment update' })
  @ApiBody({ type: CommentUpdateInputDto })
  async update(
    @User() owner: UserEntity,
    @Body() commentUpdateInputDto: CommentUpdateInputDto,
  ) {
    return await this.commentService.update(owner, commentUpdateInputDto)
  }
}
