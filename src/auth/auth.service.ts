import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './entities/user.entity'
import { Repository } from 'typeorm'
import { UserRegisterInputDto } from './dtos/user.register.dto'
import { UserLoginInputDto } from './dtos/user.login.dto'
import { JwtService } from '@nestjs/jwt'
import { JwtPayloadType } from './jwt/jwt.payload.type'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}
  async checkEmailExist(email: string): Promise<boolean> {
    const emailExist = await this.userEntity.findOne({
      where: {
        email,
      },
    })
    return !!emailExist
  }

  async checkNicknameExist(nickname: string): Promise<boolean> {
    const nicknameExist = await this.userEntity.findOne({
      where: {
        nickname,
      },
    })
    return !!nicknameExist
  }

  async register({
    email,
    password,
    nickname,
    avatarImage,
    social,
  }: UserRegisterInputDto) {
    try {
      if (!social) {
        if (
          !(await this.checkEmailExist(email)) &&
          !(await this.checkNicknameExist(nickname))
        ) {
          await this.userEntity.save(
            this.userEntity.create({
              email,
              password,
              nickname,
              avatarImage: avatarImage ?? null,
              social: null,
            }),
          )
          return {
            access: true,
            success: 'Success register user account',
          }
        }
        throw new UnauthorizedException('Please you check email and nickname')
      } else if (social) {
        if (!(await this.checkEmailExist(email))) {
        }
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }

  async login({ email, password }: UserLoginInputDto) {
    try {
      const user = await this.userEntity.findOne({
        where: {
          email,
        },
        select: ['email', 'password'],
      })
      if (!user) {
        throw new UnauthorizedException('Not found this user')
      }
      const confirmPassword = await user.confirmPassword(password)
      if (!confirmPassword) {
        throw new HttpException('No match password', HttpStatus.BAD_REQUEST)
      }
      const payload: JwtPayloadType = {
        email: user.email,
        pk: user.pk,
      }
      return {
        access: true,
        success: 'Success login',
        token: this.jwtService.sign(payload),
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }
}
