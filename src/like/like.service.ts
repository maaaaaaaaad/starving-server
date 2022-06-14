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
import {
  LikeGetOneInputDto,
  LikeGetOneOutputDto,
} from './dtos/like.get.one.dto'

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
    let like = await this.likeEntity
      .createQueryBuilder('like')
      .innerJoin('like.owner', 'owner')
      .innerJoin('like.recipe', 'recipe')
      .select(['like.pk'])
      .where('owner.pk = :ownerPk', { ownerPk: owner.pk })
      .andWhere('recipe.pk = :recipePk', { recipePk })
      .getOne()
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
    const queryRunner = this.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      like = await queryRunner.manager
        .getRepository(LikeEntity)
        .create({ owner, recipe })
      recipe.likesCount += 1
      await Promise.all([
        queryRunner.manager.getRepository(RecipeEntity).save(recipe),
        queryRunner.manager.getRepository(LikeEntity).save(like),
      ])
      await queryRunner.commitTransaction()
      return {
        access: true,
        message: 'Success add like',
      }
    } catch (e) {
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException(e.message)
    } finally {
      await queryRunner.release()
    }
  }

  async getOne(
    owner: UserEntity,
    { recipePk }: LikeGetOneInputDto,
  ): Promise<LikeGetOneOutputDto> {
    const like = await this.likeEntity
      .createQueryBuilder('like')
      .innerJoin('like.owner', 'owner')
      .innerJoin('like.recipe', 'recipe')
      .where('owner.pk = :ownerPk', { ownerPk: owner.pk })
      .andWhere('recipe.pk = :recipePk', { recipePk })
      .select(['like.pk', 'owner.pk', 'recipe.pk'])
      .getOne()
    if (!like) {
      return {
        access: false,
        message: 'Not found like',
      }
    }
    try {
      return {
        access: true,
        like,
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }

  async my(
    { pk }: UserEntity,
    { page, size }: LikeListInputDto,
  ): Promise<LikeListOutputDto> {
    const [likes, likesCount] = await this.likeEntity
      .createQueryBuilder('like')
      .innerJoin('like.owner', 'owner')
      .innerJoin('like.recipe', 'recipe')
      .where('owner.pk = :pk', { pk })
      .select(['like.pk', 'recipe'])
      .take(size)
      .skip((page - 1) * size)
      .getManyAndCount()
    try {
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
    const like = await this.likeEntity
      .createQueryBuilder('like')
      .innerJoin('like.owner', 'owner')
      .innerJoin('like.recipe', 'recipe')
      .where('owner.pk = :ownerPk', { ownerPk: owner.pk })
      .andWhere('recipe.pk = :recipePk', { recipePk })
      .select(['like.pk'])
      .getOne()
    if (!like) {
      return {
        access: false,
        message: 'Not found like',
      }
    }
    const recipe = await this.recipeEntity.findOne({ where: { pk: recipePk } })
    const queryRunner = this.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      recipe.likesCount -= 1
      await Promise.all([
        queryRunner.manager.getRepository(RecipeEntity).save(recipe),
        queryRunner.manager.getRepository(LikeEntity).delete(like.pk),
      ])
      await queryRunner.commitTransaction()
      return {
        access: true,
        message: 'Success delete like',
      }
    } catch (e) {
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException(e.message)
    } finally {
      await queryRunner.release()
    }
  }
}
