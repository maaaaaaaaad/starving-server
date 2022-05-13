import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserRegisterInputDto } from './dtos/user.register.dto'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { UserLoginInputDto } from './dtos/user.login.dto'
import { JwtAuthGuard } from './jwt/jwt-auth.guard'
import { User } from '../common/decorators/user.decorator'
import { UserEntity } from './entities/user.entity'
import { UserUpdateInputDto } from './dtos/user.update.dto'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'Register user account 👈🏻 Social login here',
  })
  @ApiBody({ type: UserRegisterInputDto })
  async register(@Body() userRegisterInputDto: UserRegisterInputDto) {
    return await this.authService.register(userRegisterInputDto)
  }

  @Post('login')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'Login user account',
  })
  @ApiBody({ type: UserLoginInputDto })
  async login(@Body() userLoginInputDto: UserLoginInputDto) {
    return await this.authService.login(userLoginInputDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'Get current user data with using access-token',
  })
  @ApiBearerAuth('access-token')
  async profile(@User() user: UserEntity) {
    return user
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'Update user data',
  })
  @ApiBody({ type: UserUpdateInputDto })
  @ApiBearerAuth('access-token')
  async update(
    @User() user: UserEntity,
    @Body() userUpdateInputDto: UserUpdateInputDto,
  ) {
    return await this.authService.update(user.pk, userUpdateInputDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiOperation({ summary: 'Delete user account' })
  @ApiBearerAuth('access-token')
  async delete(@User() user: UserEntity) {
    return await this.authService.delete(user.pk)
  }
}
