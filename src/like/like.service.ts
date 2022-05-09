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
    const recipe = await this.recipeEntity.findOne({ where: { pk: recipePk } })
    if (!recipe) {
      return {
        access: false,
        message: 'Not found recipe',
      }
    }
    try {
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }
}
