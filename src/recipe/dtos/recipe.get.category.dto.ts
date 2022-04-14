import { PaginationDto } from '../../common/dtos/pagination.dto'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { CategoryValues } from '../entities/category.entity'

export class RecipeGetCategoryInputDto extends PaginationDto {
  @IsEnum(CategoryValues)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Category values',
    enum: CategoryValues,
    nullable: false,
    required: true,
  })
  values: CategoryValues
}
