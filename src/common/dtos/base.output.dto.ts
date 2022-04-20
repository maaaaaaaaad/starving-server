import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional } from 'class-validator'

export class BaseOutputDto {
  @IsBoolean()
  @ApiProperty({
    description: 'Api access',
    type: Boolean,
  })
  access: boolean

  @IsOptional()
  @ApiProperty({
    description: 'Api message',
    type: String,
    nullable: true,
  })
  message?: string
}
