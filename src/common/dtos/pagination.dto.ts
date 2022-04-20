import { IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class PaginationInputDto {
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

export class PaginationOutputDto {
  @IsNumber()
  @ApiProperty({
    description: 'Get item total count',
    type: Number,
  })
  totalCount: number

  @IsNumber()
  @ApiProperty({
    description: 'Get page total count',
    type: Number,
  })
  totalPages: number
}
