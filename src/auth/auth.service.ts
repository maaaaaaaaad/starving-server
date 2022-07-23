import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './entities/user.entity'
import { Repository } from 'typeorm'
import { UserRegisterInputDto } from './dtos/user.register.dto'
import { UserLoginInputDto } from './dtos/user.login.dto'
import { JwtService } from '@nestjs/jwt'
import { JwtPayloadType } from './jwt/jwt.payload.type'
import { UserUpdateInputDto } from './dtos/user.update.dto'

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
    return !emailExist
  }

  async checkNicknameExist(nickname: string): Promise<boolean> {
    const nicknameExist = await this.userEntity.findOne({
      where: {
        nickname,
      },
    })
    return !nicknameExist
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
        const { email: isEmail, nickname: isNickname } = await this.userEntity
          .createQueryBuilder('user')
          .where('user.EMAIL = :email', { email })
          .orWhere('user.NICKNAME = :nickname', { nickname })
          .getOne()
        if (isEmail === email) {
          return {
            access: false,
            message: 'This email already to exists',
          }
        }
        if (isNickname === nickname) {
          return {
            access: false,
            message: 'This nickname already to exists',
          }
        }
        const user = this.userEntity.create({
          email,
          password,
          nickname,
          avatarImage: avatarImage === '' ? null : avatarImage,
          social: null,
        })
        await this.userEntity.save(user)
        return {
          access: true,
          success: 'Success register user account',
        }
      } else if (social) {
        const user = await this.userEntity.findOne({
          where: {
            email,
          },
        })
        let payload: JwtPayloadType
        if (!user) {
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
    const user = await this.userEntity
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .select(['user.pk', 'user.email', 'user.password'])
      .getOne()
    if (!user) throw new NotFoundException('Not found user')
    else if (user) {
      const confirmPassword = await user.confirmPassword(password)
      if (!confirmPassword) {
        return {
          access: false,
          error: 'No match password',
        }
      }
    }
    try {
      const payload: JwtPayloadType = {
        email: user.email,
        pk: user.pk,
      }
      const token = this.jwtService.sign(payload)
      return {
        access: true,
        success: 'Success login',
        token,
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

  async update(pk: number, { nickname, password }: UserUpdateInputDto) {
    try {
      const user = await this.userEntity.findOne({
        where: {
          pk,
        },
      })
      if (!user) {
        return {
          access: false,
          message: 'Not found this user',
        }
      }
      if (password) {
        user.password = password
      }
      if (nickname) {
        user.nickname = nickname
      }
      await this.userEntity.save(user)
      return {
        access: true,
        message: 'Success update profile',
        user,
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }

  async avatarImageUpload(pk: number, location: string) {
    const user = await this.userEntity.findOne({
      where: {
        pk,
      },
    })
    if (!user) {
      return {
        access: false,
        message: 'Not found this user',
      }
    }
    user.avatarImage = location
    await this.userEntity.save(user)
    return {
      access: true,
      message: 'Success update avatar image',
      user,
    }
  }

  async delete(pk: number) {
    try {
      await this.userEntity.delete(pk)
      return {
        access: true,
        message: 'Delete this user account',
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }
}
