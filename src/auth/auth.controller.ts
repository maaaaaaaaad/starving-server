import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserRegisterInputDto } from './dtos/user.register.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserLoginInputDto } from './dtos/user.login.dto'
import { JwtAuthGuard } from './jwt/jwt-auth.guard'
import { User } from '../common/decorators/user.decorator'
import { UserEntity } from './entities/user.entity'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register user account',
  })
  @ApiBody({ type: UserRegisterInputDto })
  async register(@Body() userRegisterInputDto: UserRegisterInputDto) {
    return await this.authService.register(userRegisterInputDto)
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login user account',
  })
  @ApiBody({ type: UserLoginInputDto })
  async login(@Body() userLoginInputDto: UserLoginInputDto) {
    return await this.authService.login(userLoginInputDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get current user data with using access-token',
  })
  @ApiBearerAuth('access-token')
  async profile(@User() user: UserEntity) {
    return user
  }
}
