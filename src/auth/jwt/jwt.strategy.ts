import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { JwtPayloadType } from './jwt.payload.type'
import { AuthService } from '../auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'JWT_KEY',
    })
  }

  async validate(payload: JwtPayloadType) {
    const user = await this.authService.findUserByPrimaryKey(payload.pk)
    if (!user) {
      throw new UnauthorizedException('Not found this user')
    }
    return user
  }
}
