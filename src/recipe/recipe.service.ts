import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RecipeEntity } from './entities/recipe.entity'
import { Repository } from 'typeorm'
import { RecipeRegisterInputDto } from './dtos/recipe.register.dto'
import { CategoryEntity } from './entities/category.entity'
import { UserEntity } from '../auth/entities/user.entity'

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipe: Repository<RecipeEntity>,
    @InjectRepository(CategoryEntity)
    private readonly category: Repository<CategoryEntity>,
  ) {}

  async register(
    owner: UserEntity,
    {
      title,
      description,
      foodName,
      amount,
      cookTime,
      foodIngredients,
      cookImages,
      category,
    }: RecipeRegisterInputDto,
  ) {
    try {
      const recipe = await this.recipe.create({
        title,
        description,
        foodName,
        amount,
        cookTime,
        foodIngredients,
        cookImages,
      })
      recipe.owner = owner
      let categoryValue = await this.category.findOne({
        where: {
          values: category,
        },
      })
      if (!categoryValue) {
        categoryValue = await this.category.save(
          this.category.create({ values: category }),
        )
      }
      recipe.category = categoryValue
      await this.recipe.save(recipe)
      return {
        access: true,
        message: `Success recipe ${recipe.title}`,
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }
}
