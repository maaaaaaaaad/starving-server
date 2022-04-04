import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './entities/user.entity'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: `${process.env.JWT_SECRET_KEY}`,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
