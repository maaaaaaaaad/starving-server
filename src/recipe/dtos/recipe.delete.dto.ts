import { PickType } from '@nestjs/swagger'
import { RecipeEntity } from '../entities/recipe.entity'

export class RecipeDeleteInputDto extends PickType(RecipeEntity, ['pk']) {}
