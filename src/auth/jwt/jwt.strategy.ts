import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

import { JwtPayloadType } from './jwt.payload.type'
import { AuthService } from '../auth.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    })
  }

  async validate(payload: JwtPayloadType) {
    const user = await this.authService.findUserByPrimaryKey(payload.pk)
    if (!user) {
      return {
        access: false,
        error: 'Not found this user',
      }
    }
    return user
  }
}
