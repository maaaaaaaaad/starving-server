import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { LikeService } from './like.service'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { LikeRegisterInputDto } from './dtos/like.register.dto'
import { User } from '../common/decorators/user.decorator'
import { UserEntity } from '../auth/entities/user.entity'

@Controller('like')
@ApiTags('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('access-token')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: LikeRegisterInputDto })
  @ApiOperation({ summary: 'register like' })
  async register(
    @User() owner: UserEntity,
    @Body() likeRegisterInputDto: LikeRegisterInputDto,
  ) {
    return await this.likeService.register(owner, likeRegisterInputDto)
  }
}
