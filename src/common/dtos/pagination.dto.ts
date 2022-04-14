import { IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class PaginationDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Get page count',
    type: Number,
    nullable: false,
    required: true,
  })
  page: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Get field count',
    type: Number,
    nullable: false,
    required: true,
  })
  size: number
}
