import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm'
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
import { RecipeEntity } from '../../recipe/entities/recipe.entity'

export enum Social {
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
    example: 'starving@gmail.com',
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
    format: 'password',
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

  @Column({ name: 'AVATAR_IMAGE', nullable: true, default: null })
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User avatar image',
    required: false,
    nullable: true,
    type: String || null,
  })
  avatarImage?: string | null

  @Column({ name: 'SOCIAL', nullable: true, enum: Social, default: null })
  @IsEnum(Social)
  @IsOptional()
  @ApiProperty({
    description: 'Check social user',
    nullable: true,
    required: false,
    enum: Social,
  })
  social?: Social

  @OneToMany(() => RecipeEntity, (recipe) => recipe.owner)
  recipes: RecipeEntity[]

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
