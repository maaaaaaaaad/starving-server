import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RecipeEntity } from './entities/recipe.entity'
import { Repository } from 'typeorm'
import { RecipeRegisterInputDto } from './dtos/recipe.register.dto'
import { CategoryEntity } from './entities/category.entity'
import { UserEntity } from '../auth/entities/user.entity'
import { RecipeGetAllInputDto } from './dtos/recipe.get.all.dto'
import { RecipeGetOneInputDto } from './dtos/recipe.get.one.dto'

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

  async getAll({ page, size }: RecipeGetAllInputDto) {
    try {
      const [recipes, recipesCount] = await this.recipe.findAndCount({
        relations: ['owner'],
        take: size,
        skip: (page - 1) * size,
        order: {
          createAt: 'DESC',
        },
      })
      if (recipesCount === 0) {
        return {
          access: false,
          message: 'No recipes',
        }
      }
      return {
        access: true,
        message: 'Success',
        recipesCount,
        totalPages: Math.ceil(recipesCount / size),
        recipes,
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }

  async getOne({ pk }: RecipeGetOneInputDto) {
    try {
      const recipe = await this.recipe.findOne({
        relations: ['owner'],
        where: { pk },
      })
      if (!recipe) {
        return {
          access: false,
          message: 'Not found this recipe',
        }
      }
      return {
        access: true,
        message: `Success find recipe ${recipe.title}`,
        recipe,
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }
}
