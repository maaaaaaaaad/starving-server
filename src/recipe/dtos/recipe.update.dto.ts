import { OmitType, PartialType } from '@nestjs/swagger'
import { RecipeRegisterInputDto } from './recipe.register.dto'

export class RecipeUpdateInputDto extends PartialType(
  OmitType(RecipeRegisterInputDto, ['title', 'category']),
) {}
