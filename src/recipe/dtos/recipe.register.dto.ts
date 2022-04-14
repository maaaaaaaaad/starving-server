import { ApiProperty, PickType } from '@nestjs/swagger'
import { RecipeEntity } from '../entities/recipe.entity'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { CategoryValues } from '../entities/category.entity'

export class RecipeRegisterInputDto extends PickType(RecipeEntity, [
  'title',
  'description',
  'foodName',
  'amount',
  'foodIngredient',
  'cookTime',
  'cookImages',
]) {
  @IsEnum(CategoryValues)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Category values',
    enum: CategoryValues,
    nullable: false,
    required: true,
  })
  category: CategoryValues
}
