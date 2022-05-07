import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LikeEntity } from './entities/like.entity'
import { Repository } from 'typeorm'
import {
  LikeRegisterInputDto,
  LikeRegisterOutputDto,
} from './dtos/like.register.dto'
import { RecipeService } from '../recipe/recipe.service'
import { UserEntity } from '../auth/entities/user.entity'

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeEntity)
    private readonly likeEntity: Repository<LikeEntity>,
    private readonly recipeService: RecipeService,
  ) {}

  async register(
    owner: UserEntity,
    { recipePk }: LikeRegisterInputDto,
  ): Promise<LikeRegisterOutputDto> {
    try {
      const { access, recipe } = await this.recipeService.getOne({
        pk: recipePk,
      })
      if (access) {
        const like = await this.likeEntity.create({
          owner,
          recipe,
        })
        await this.likeEntity.save(like)
        return {
          access: true,
          message: 'Success add like',
        }
      }
      return {
        access: false,
        message: 'Failed add like',
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }
}
