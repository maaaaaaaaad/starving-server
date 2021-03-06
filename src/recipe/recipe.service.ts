import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RecipeEntity } from './entities/recipe.entity'
import { Connection, Repository } from 'typeorm'
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
      const recipe = queryRunner.manager.getRepository(RecipeEntity).create({
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
    const [recipes, recipesCount] = await this.recipe
      .createQueryBuilder('recipe')
      .innerJoin('recipe.owner', 'owner')
      .select(['recipe', 'owner.nickname', 'owner.avatarImage'])
      .take(size)
      .skip((page - 1) * size)
      .getManyAndCount()
    try {
      return {
        recipesCount,
        totalPages: Math.ceil(recipesCount / size),
        recipes,
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }

  async getOne({ pk }: RecipeGetOneInputDto) {
    const recipe = await this.recipe
      .createQueryBuilder('recipe')
      .innerJoin('recipe.owner', 'owner')
      .where('recipe.pk = :pk', { pk })
      .select(['recipe', 'owner.nickname', 'owner.avatarImage'])
      .getOne()
    if (!recipe) throw new NotFoundException('Not found recipe')
    try {
      return {
        access: true,
        message: `Success find recipe ${recipe.title}`,
        recipe,
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }

  async getMy({ pk }: UserEntity, { page, size }: RecipeGetMyInputDto) {
    const [recipes, recipesCount] = await this.recipe
      .createQueryBuilder('recipe')
      .where('recipe.owner = :pk', { pk })
      .take(size)
      .skip((page - 1) * size)
      .orderBy('recipe.createAt', 'DESC')
      .getManyAndCount()
    try {
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
    const [recipes, recipesCount] = await this.recipe
      .createQueryBuilder('recipe')
      .innerJoin('recipe.category', 'category')
      .innerJoin('recipe.owner', 'owner')
      .select(['recipe', 'owner.nickname', 'owner.avatarImage'])
      .where('category.values = :values', { values })
      .take(size)
      .skip((page - 1) * size)
      .getManyAndCount()
    try {
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
    const recipe = await this.recipe
      .createQueryBuilder('recipe')
      .innerJoin('recipe.owner', 'owner')
      .where('recipe.pk = :pk', { pk })
      .select([
        'owner.pk',
        'recipe.title',
        'recipe.description',
        'recipe.mainText',
        'recipe.cookImages',
      ])
      .getOne()
    if (!recipe) throw new NotFoundException('Not found recipe')
    if (recipe.owner.pk !== owner.pk)
      throw new ConflictException('Not match owner primary key')
    try {
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
    const recipe = await this.recipe
      .createQueryBuilder('recipe')
      .where('recipe.pk = :pk', { pk })
      .innerJoin('recipe.owner', 'owner')
      .select(['recipe.pk', 'owner.pk'])
      .getOne()
    if (!recipe) throw new NotFoundException('Not found recipe')
    if (recipe.owner.pk !== owner.pk)
      throw new ConflictException('Not match owner primary key')
    try {
      await this.recipe.delete(recipe.pk)
      return {
        access: true,
        message: 'Success delete recipe',
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
      const [recipes, recipesCount] = await this.recipe
        .createQueryBuilder('recipe')
        .where('recipe.title like :keyword', { keyword: `%${keyword}%` })
        .innerJoin('recipe.owner', 'owner')
        .take(size)
        .skip((page - 1) * size)
        .orderBy('recipe.createAt', 'DESC')
        .getManyAndCount()
      return {
        totalCount: recipesCount,
        totalPages: Math.ceil(recipesCount / size),
        recipes,
      }
    } catch (e) {
      if (e instanceof Error) throw new Error()
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
