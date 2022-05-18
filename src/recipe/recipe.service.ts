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
import {
  DeleteRecipeImageInputDto,
  DeleteRecipeImageOutputDto,
} from '../upload/dtos/delete.recipe.image.dto'

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
    const queryRunner = this.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      const recipe = await queryRunner.manager
        .getRepository(RecipeEntity)
        .create({
          title,
          description,
          mainText,
          cookImages,
        })
      recipe.owner = owner
      let categoryValue = await queryRunner.manager
        .getRepository(CategoryEntity)
        .findOne({
          where: {
            values: category,
          },
        })
      if (!categoryValue) {
        categoryValue = await queryRunner.manager
          .getRepository(CategoryEntity)
          .save({ values: category })
      }
      recipe.category = categoryValue
      await queryRunner.manager.getRepository(RecipeEntity).save(recipe)
      await queryRunner.commitTransaction()
      return {
        access: true,
        message: `Success recipe ${title}`,
      }
    } catch (e) {
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException(e.message)
    } finally {
      await queryRunner.release()
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

  async deleteImage(
    { pk: ownerId }: UserEntity,
    { pk, image }: DeleteRecipeImageInputDto,
  ): Promise<DeleteRecipeImageOutputDto> {
    try {
      const recipe = await this.recipe.findOne({
        where: {
          pk,
        },
      })
      if (!recipe) {
        return {
          access: false,
          message: 'Not found recipe',
        }
      }
      if (recipe.ownerId !== ownerId) {
        return {
          access: false,
          message: 'Owner do not match',
        }
      }
      if (!recipe.cookImages.find((current) => current === image)) {
        return {
          access: false,
          message: 'Not found image url',
        }
      }

      if (recipe.cookImages.length === 1) {
        return {
          access: false,
          message: 'There is only one image, it cannot be deleted.',
        }
      }
      recipe.cookImages = recipe.cookImages.filter(
        (current) => current !== image,
      )
      await this.recipe.save(recipe)
      return {
        access: true,
        message: `Delete ${image}`,
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }
}
