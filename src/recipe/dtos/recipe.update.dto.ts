import { OmitType, PartialType } from '@nestjs/swagger'
import { RecipeEntity } from '../entities/recipe.entity'

export class RecipeUpdateInputDto extends PartialType(
  OmitType(RecipeEntity, [
    'title',
    'category',
    'createAt',
    'updateAt',
    'deleteAt',
  ]),
) {}
