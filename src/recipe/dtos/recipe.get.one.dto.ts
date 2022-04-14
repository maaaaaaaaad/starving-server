import { PickType } from '@nestjs/swagger'
import { RecipeEntity } from '../entities/recipe.entity'

export class RecipeGetOneInputDto extends PickType(RecipeEntity, ['pk']) {}
