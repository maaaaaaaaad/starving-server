import { Injectable, InternalServerErrorException } from '@nestjs/common'
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
        return {
          access: false,
          error: 'Please you check email and nickname',
        }
      } else if (social) {
        let payload: JwtPayloadType
        if (!(await this.checkEmailExist(email))) {
          await this.userEntity.save(
            this.userEntity.create({
              email,
              password,
              nickname,
              avatarImage: avatarImage ?? null,
              social,
            }),
          )
          const socialUser = await this.userEntity.findOne({
            where: {
              email,
            },
          })
          payload = { email: socialUser.email, pk: socialUser.pk }
          return {
            access: true,
            success: 'Success register social user',
            token: this.jwtService.sign(payload),
          }
        }
        const socialUser = await this.userEntity.findOne({
          where: {
            email,
          },
        })
        payload = { email: socialUser.email, pk: socialUser.pk }
        return {
          access: true,
          success: 'Success login social user',
          token: this.jwtService.sign(payload),
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
        select: ['email', 'password', 'pk'],
      })
      if (!user) {
        return {
          access: false,
          error: 'Not found this user',
        }
      } else if (user) {
        const confirmPassword = await user.confirmPassword(password)
        if (!confirmPassword) {
          return {
            access: false,
            error: 'No match password',
          }
        }
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

  async findUserByPrimaryKey(pk: number): Promise<UserEntity> {
    return await this.userEntity.findOne({
      where: {
        pk,
      },
    })
  }
}
