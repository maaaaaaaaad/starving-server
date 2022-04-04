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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
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
      if (
        !(await this.checkEmailExist(email)) &&
        !(await this.checkNicknameExist(nickname))
      ) {
        if (!social) {
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
      }
      throw new UnauthorizedException('Please you check email and nickname')
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }
}
