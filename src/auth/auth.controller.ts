import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserRegisterInputDto } from './dtos/user.register.dto'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserLoginInputDto } from './dtos/user.login.dto'

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
}
