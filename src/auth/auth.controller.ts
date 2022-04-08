import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
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
import { UserCheckEmailInputDto } from './dtos/user.check.email.dto'
import { UserCheckNicknameInputDto } from './dtos/user.check.nickname.dto'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('check/email')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'Check you input the email',
  })
  @ApiBody({ type: UserCheckEmailInputDto })
  async checkEmailExist(@Body() email: UserCheckEmailInputDto) {
    return await this.authService.checkEmailExist(email)
  }

  @Post('check/nickname')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'Check you input the nickname',
  })
  @ApiBody({ type: UserCheckNicknameInputDto })
  async checkNicknameExist(@Body() nickname: UserCheckNicknameInputDto) {
    return await this.authService.checkNicknameExist(nickname)
  }

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
}
