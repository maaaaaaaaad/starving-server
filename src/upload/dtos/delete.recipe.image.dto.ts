import { RecipeGetOneInputDto } from '../../recipe/dtos/recipe.get.one.dto'
import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { BaseOutputDto } from '../../common/dtos/base.output.dto'

export class DeleteRecipeImageInputDto extends RecipeGetOneInputDto {
  @IsString()
  @ApiProperty({ required: true, type: String, nullable: false })
  image: string
}

export class DeleteRecipeImageOutputDto extends BaseOutputDto {}
