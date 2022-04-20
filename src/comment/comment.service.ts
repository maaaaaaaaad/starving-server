import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CommentEntity } from './entities/comment.entity'
import { Repository } from 'typeorm'
import {
  CommentRegisterInputDto,
  CommentRegisterOutputDto,
} from './dtos/comment.register.dto'
import { RecipeEntity } from '../recipe/entities/recipe.entity'
import { UserEntity } from '../auth/entities/user.entity'

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly comment: Repository<CommentEntity>,
    @InjectRepository(RecipeEntity)
    private readonly recipe: Repository<RecipeEntity>,
  ) {}

  async register(
    owner: UserEntity,
    { content, recipePk }: CommentRegisterInputDto,
  ): Promise<CommentRegisterOutputDto> {
    try {
      const recipe = await this.recipe.findOne({
        where: {
          pk: recipePk,
        },
      })
      if (!recipe) {
        return {
          access: false,
          message: 'Not found recipe',
        }
      }
      const comment = this.comment.create({
        content,
      })
      comment.owner = owner
      comment.recipe = recipe
      await this.comment.save(comment)
      return {
        access: true,
        message: 'Success register comment',
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }
}
