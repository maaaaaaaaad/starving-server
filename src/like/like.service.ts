import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LikeEntity } from './entities/like.entity'
import { Connection, Repository } from 'typeorm'
import {
  LikeRegisterInputDto,
  LikeRegisterOutputDto,
} from './dtos/like.register.dto'
import { UserEntity } from '../auth/entities/user.entity'
import { RecipeEntity } from '../recipe/entities/recipe.entity'
import { LikeListInputDto, LikeListOutputDto } from './dtos/like.list.dto'

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeEntity)
    private readonly likeEntity: Repository<LikeEntity>,
    @InjectRepository(RecipeEntity)
    private readonly recipeEntity: Repository<RecipeEntity>,
    private readonly connection: Connection,
  ) {}

  async register(
    owner: UserEntity,
    { recipePk }: LikeRegisterInputDto,
  ): Promise<LikeRegisterOutputDto> {
    try {
      let like = await this.likeEntity.findOne({
        relations: ['owner', 'recipe'],
        where: {
          owner: {
            pk: owner.pk,
          },
          recipe: {
            pk: recipePk,
          },
        },
      })
      if (like) {
        return {
          access: false,
          message: 'Like already to taken',
        }
      }
      const recipe = await this.recipeEntity.findOne({
        where: { pk: recipePk },
      })
      if (!recipe) {
        return {
          access: false,
          message: 'Not found recipe',
        }
      }
      await this.connection.transaction(async (manager) => {
        like = await this.likeEntity.create({ owner, recipe })
        recipe.likesCount += 1
        await manager.save(recipe)
        await manager.save(like)
      })
      return {
        access: true,
        message: 'Success add like',
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }

  async my(
    { pk }: UserEntity,
    { page, size }: LikeListInputDto,
  ): Promise<LikeListOutputDto> {
    try {
      const [likes, likesCount] = await this.likeEntity.findAndCount({
        relations: ['owner', 'recipe'],
        where: {
          owner: {
            pk,
          },
        },
        take: size,
        skip: (page - 1) * size,
        order: {
          createAt: 'DESC',
        },
      })
      return {
        likes,
        totalCount: likesCount,
        totalPages: Math.ceil(likesCount / size),
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }

  async delete(
    owner: UserEntity,
    { recipePk }: LikeRegisterInputDto,
  ): Promise<LikeRegisterOutputDto> {
    try {
      const like = await this.likeEntity.findOne({
        where: {
          owner: {
            pk: owner.pk,
          },
          recipe: {
            pk: recipePk,
          },
        },
      })
      if (!like) {
        return {
          access: false,
          message: 'Not found like',
        }
      }
      const recipe = await this.recipeEntity.findOne({
        where: { pk: recipePk },
      })
      recipe.likesCount -= 1
      await this.recipeEntity.save(recipe)
      await this.likeEntity.delete(like.pk)
      return {
        access: true,
        message: 'Success delete like',
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }
}
