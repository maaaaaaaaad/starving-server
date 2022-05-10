import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UserEntity } from './entities/user.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

describe('AuthService', () => {
  let service: AuthService

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
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
