import { IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { BaseOutputDto } from '../../common/dtos/base.output.dto'

export class LikeRegisterInputDto {
  @IsNumber()
  @ApiProperty({ required: true, type: Number, nullable: false })
  recipePk: number
}

export class LikeRegisterOutputDto extends BaseOutputDto {}
