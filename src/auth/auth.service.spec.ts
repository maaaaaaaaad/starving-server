import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UserEntity } from './entities/user.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'

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
          provide: getRepositoryToken(JwtService),
          useValue: {
            sign: jest.fn(),
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

  describe('register user account', () => {
    it('should fail if email already exists', async () => {
      userRepository.findOne.mockResolvedValue({
        email: 'mad@gmail.com',
      })
      const result = await service.register({
        email: 'mad@gmail.com',
        password: '',
        nickname: '',
      })
      expect(result).toMatchObject({
        access: false,
        message: 'Already to this user email',
      })
    })
  })
})
