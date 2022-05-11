import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
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
import { LikeDeleteInputDto } from './dtos/like.delete.dto'
import { LikeListInputDto } from './dtos/like.list.dto'

@Controller('like')
@ApiTags('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('access-token')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: LikeRegisterInputDto })
  @ApiOperation({ summary: 'Register like' })
  async register(
    @User() owner: UserEntity,
    @Body() likeRegisterInputDto: LikeRegisterInputDto,
  ) {
    return await this.likeService.register(owner, likeRegisterInputDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth('access-token')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Get my likes' })
  async my(
    @User() owner: UserEntity,
    @Query() likeListInputDto: LikeListInputDto,
  ) {
    return await this.likeService.my(owner, likeListInputDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiBearerAuth('access-token')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: LikeDeleteInputDto })
  @ApiOperation({ summary: 'Delete like' })
  async delete(
    @User() owner: UserEntity,
    @Body() likeDeleteInputDto: LikeDeleteInputDto,
  ) {
    return await this.likeService.delete(owner, likeDeleteInputDto)
  }
}
