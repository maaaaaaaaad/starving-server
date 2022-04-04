import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import * as bcrypt from 'bcrypt'
import { InternalServerErrorException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export enum Social {
  GOOGLE = 'GOOGLE',
  KAKAO = 'KAKAO',
  NAVER = 'NAVER',
}

@Entity({ name: 'User' })
export class UserEntity extends CoreEntity {
  @Column({ name: 'EMAIL', nullable: false, unique: true })
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User email',
    nullable: false,
    required: true,
    example: 'thepro@gmail.com',
    type: String,
  })
  email: string

  @Column({ name: 'PASSWORD', nullable: false, unique: true, select: false })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User password',
    nullable: false,
    required: true,
    example: 'abcabc123123',
    type: String,
  })
  password: string

  @Column({ name: 'NICKNAME', nullable: false, unique: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User nickname',
    nullable: false,
    required: true,
    example: 'mynickname',
    type: String,
  })
  nickname: string

  @Column({ name: 'AVATAR_IMAGE', nullable: true })
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User avatar image',
    required: false,
    nullable: true,
    example: 'Avatar image url',
    type: String,
  })
  avatarImage?: string

  @Column({ name: 'SOCIAL', nullable: true, enum: Social, default: null })
  @IsEnum(Social)
  @IsOptional()
  @ApiProperty({
    description: 'Check social user',
    nullable: true,
    required: false,
    default: null,
    enum: Social,
  })
  social?: Social

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10)
      } catch (e) {
        throw new InternalServerErrorException()
      }
    }
  }

  async confirmPassword(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.password)
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }
}
