import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RecipeEntity } from './entities/recipe.entity'
import { Connection, ILike, Repository } from 'typeorm'
import { RecipeRegisterInputDto } from './dtos/recipe.register.dto'
import { CategoryEntity } from './entities/category.entity'
import { UserEntity } from '../auth/entities/user.entity'
import { RecipeGetAllInputDto } from './dtos/recipe.get.all.dto'
import { RecipeGetOneInputDto } from './dtos/recipe.get.one.dto'
import { RecipeGetMyInputDto } from './dtos/recipe.get.my.dto'
import { RecipeGetCategoryInputDto } from './dtos/recipe.get.category.dto'
import { RecipeDeleteInputDto } from './dtos/recipe.delete.dto'
import { RecipeUpdateInputDto } from './dtos/recipe.update.dto'
import {
  RecipeSearchInputDto,
  RecipeSearchOutputDto,
} from './dtos/recipe.search.dto'

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipe: Repository<RecipeEntity>,
    @InjectRepository(CategoryEntity)
    private readonly category: Repository<CategoryEntity>,
    private readonly connection: Connection,
  ) {}

  async register(
    owner: UserEntity,
    {
      title,
      description,
      mainText,
      cookImages,
      category,
    }: RecipeRegisterInputDto,
  ) {
    try {
      await this.connection.transaction(async (manager) => {
        const recipe = await this.recipe.create({
          title,
          description,
          mainText,
          cookImages,
        })
        recipe.owner = owner
        let categoryValue = await this.category.findOne({
          where: {
            values: category,
          },
        })
        if (!categoryValue) {
          categoryValue = await manager.save(
            this.category.create({ values: category }),
          )
        }
        recipe.category = categoryValue
        await manager.save(recipe)
      })
      return {
        access: true,
        message: `Success recipe ${title}`,
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

  async getMy(owner: UserEntity, { page, size }: RecipeGetMyInputDto) {
    try {
      const [recipes, recipesCount] = await this.recipe.findAndCount({
        where: { owner: { pk: owner.pk } },
        take: size,
        skip: (page - 1) * size,
        order: {
          createAt: 'DESC',
        },
      })
      return {
        access: true,
        message: 'Success find my recipes',
        recipesCount,
        totalPages: Math.ceil(recipesCount / size),
        recipes,
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }

  async getByCategory({ values, page, size }: RecipeGetCategoryInputDto) {
    try {
      const [recipes, recipesCount] = await this.recipe.findAndCount({
        relations: ['owner', 'category'],
        where: {
          category: {
            values,
          },
        },
        take: size,
        skip: (page - 1) * size,
        order: {
          createAt: 'DESC',
        },
      })
      return {
        access: true,
        message: 'Success find recipes',
        recipesCount,
        totalPages: Math.ceil(recipesCount / size),
        recipes,
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }

  async update(
    owner: UserEntity,
    { pk, description, mainText, cookImages }: RecipeUpdateInputDto,
  ) {
    try {
      const recipe = await this.recipe.findOne({
        where: {
          pk,
        },
        relations: ['owner'],
      })
      if (!recipe) {
        return {
          access: false,
          message: 'Not found this recipe',
        }
      }
      if (recipe.owner.pk !== owner.pk) {
        return {
          access: false,
          message: 'Not match owner primary key',
        }
      }
      if (description) {
        recipe.description = description
      }
      if (mainText) {
        recipe.mainText = mainText
      }
      if (cookImages) {
        recipe.cookImages = [...recipe.cookImages, ...cookImages]
      }
      await this.recipe.save(recipe)
      return {
        access: true,
        message: 'Success update recipe',
        recipe,
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }

  async delete(owner: UserEntity, { pk }: RecipeDeleteInputDto) {
    try {
      const recipe = await this.recipe.findOne({
        where: { pk },
        relations: ['owner'],
      })
      if (!recipe) {
        return {
          access: false,
          message: 'Not found this recipe',
        }
      }
      if (recipe.owner.pk !== owner.pk) {
        return {
          access: false,
          message: 'Not match owner primary key',
        }
      }
      await this.recipe.delete(recipe.pk)
      return {
        access: true,
        message: `Success delete recipe ${recipe.title}`,
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }

  async search({
    keyword,
    page,
    size,
  }: RecipeSearchInputDto): Promise<RecipeSearchOutputDto> {
    try {
      const [recipes, recipesCount] = await this.recipe.findAndCount({
        where: {
          title: ILike(`%${keyword}%`),
        },
        relations: ['owner'],
        take: size,
        skip: (page - 1) * size,
        order: {
          createAt: 'DESC',
        },
      })
      return {
        totalCount: recipesCount,
        totalPages: Math.ceil(recipesCount / size),
        recipes,
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }
}
