import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UserEntity } from './entities/user.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'
import { UserRegisterInputDto } from './dtos/user.register.dto'
import { UserLoginInputDto } from './dtos/user.login.dto'
import { UserUpdateInputDto } from './dtos/user.update.dto'

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>

describe('AuthService', () => {
  let service: AuthService
  let userRepository: MockRepository<UserEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({
          session: false,
          defaultStrategy: 'jwt',
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET_KEY'),
            signOptions: { expiresIn: '1y' },
          }),
        }),
      ],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mock-token'),
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    userRepository = module.get(getRepositoryToken(UserEntity))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('checked fields', () => {
    it('should fail check email exist', async () => {
      userRepository.findOne.mockResolvedValue({
        email: 'mad@gmail.com',
      })
      const result = await service.checkEmailExist('mad@gmail.com')
      expect(result).toEqual(false)
    })

    it('should fail check nickname exist', async () => {
      userRepository.findOne.mockResolvedValue('mad')
      const result = await service.checkNicknameExist('mad')
      expect(userRepository.findOne).toBeCalledTimes(1)
      expect(result).toEqual(false)
    })
  })

  describe('register user account', () => {
    const mockValueArgs: UserRegisterInputDto = {
      email: 'mad@gmail.com',
      password: 'qweqwe123123',
      nickname: 'mad',
      social: null,
      avatarImage: null,
    }

    it('should register user account', async () => {
      userRepository.findOne.mockResolvedValue(undefined)
      userRepository.create.mockReturnValue(mockValueArgs)
      const result = await service.register(mockValueArgs)
      expect(userRepository.create).toBeCalledTimes(1)
      expect(userRepository.create).toHaveBeenCalled()
      expect(userRepository.create).toHaveBeenCalledWith(mockValueArgs)
      expect(userRepository.save).toBeCalledTimes(1)
      expect(userRepository.save).toHaveBeenCalledWith(mockValueArgs)
      expect(userRepository.save).toBeCalledTimes(1)
      expect(result).toMatchObject({
        access: true,
        success: 'Success register user account',
      })
    })
  })

  describe('login', () => {
    const loginArgs: UserLoginInputDto = {
      email: '',
      password: '',
    }
    it('should fail if email already exists', async () => {
      userRepository.findOne.mockResolvedValue(null)
      const result = await service.login(loginArgs)
      expect(userRepository.findOne).toBeCalledTimes(1)
      expect(userRepository.findOne).toHaveBeenCalledWith(expect.any(Object))
      expect(result).toMatchObject({
        access: false,
        error: 'Not found this user',
      })
    })

    it('should fail if the password is wrong', async () => {
      const mockedUser = {
        confirmPassword: jest.fn(() => Promise.resolve(false)),
      }
      userRepository.findOne.mockResolvedValue(mockedUser)
      const result = await service.login(loginArgs)
      expect(result).toMatchObject({
        access: false,
        error: 'No match password',
      })
    })

    it('should return token if the password is correct', async () => {
      const mockedUser = {
        id: 1,
        email: 'mad@gmail.com',
        confirmPassword: jest.fn(() => Promise.resolve(true)),
      }
      userRepository.findOne.mockResolvedValue(mockedUser)
      const result = await service.login(loginArgs)
      expect(result).toMatchObject({
        access: true,
        success: 'Success login',
        token: 'mock-token',
      })
    })
  })

  describe('should find user', () => {
    it('should find user with using user primary key', async () => {
      userRepository.findOne.mockResolvedValue(1)
      const result = await service.findUserByPrimaryKey(1)
      expect(result).toEqual(1)
    })

    it('should not found user', async () => {
      userRepository.findOne.mockResolvedValue(null)
      const result = await service.findUserByPrimaryKey(1)
      expect(result).toEqual(null)
    })
  })

  describe('should update user', () => {
    const current = {
      password: '12341234',
      nickname: 'mad',
    }
    const updateInputDto: UserUpdateInputDto = {
      password: 'qweqwe123123',
      nickname: 'mad123123',
    }

    it('should not found user', async () => {
      userRepository.findOne.mockResolvedValue(null)
      const result = await service.update(1, current)
      expect(userRepository.findOne).toHaveBeenCalledTimes(1)
      expect(result).toMatchObject({
        access: false,
        message: 'Not found this user',
      })
    })
  })
})
