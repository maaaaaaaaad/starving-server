import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LikeEntity } from './entities/like.entity'
import { Repository } from 'typeorm'
import {
  LikeRegisterInputDto,
  LikeRegisterOutputDto,
} from './dtos/like.register.dto'
import { UserEntity } from '../auth/entities/user.entity'
import { RecipeEntity } from '../recipe/entities/recipe.entity'

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeEntity)
    private readonly likeEntity: Repository<LikeEntity>,
    @InjectRepository(RecipeEntity)
    private readonly recipeEntity: Repository<RecipeEntity>,
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
      like = await this.likeEntity.create({ owner, recipe })
      recipe.likesCount += 1
      await this.recipeEntity.save(recipe)
      await this.likeEntity.save(like)
      return {
        access: true,
        message: 'Success add like',
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }
}
