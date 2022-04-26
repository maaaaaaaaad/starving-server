import {
  PaginationInputDto,
  PaginationOutputDto,
} from '../../common/dtos/pagination.dto'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { RecipeEntity } from '../entities/recipe.entity'

export class RecipeSearchInputDto extends PaginationInputDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  keyword: string
}

export class RecipeSearchOutputDto extends PaginationOutputDto {
  @IsOptional()
  recipes?: RecipeEntity[]
}
