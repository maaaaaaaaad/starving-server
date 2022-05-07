import { Module } from '@nestjs/common'
import { LikeController } from './like.controller'
import { LikeService } from './like.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LikeEntity } from './entities/like.entity'
import { RecipeModule } from '../recipe/recipe.module'

@Module({
  imports: [TypeOrmModule.forFeature([LikeEntity]), RecipeModule],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
