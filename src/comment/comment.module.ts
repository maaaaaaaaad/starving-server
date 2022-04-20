import { Module } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CommentController } from './comment.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommentEntity } from './entities/comment.entity'
import { RecipeEntity } from '../recipe/entities/recipe.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, RecipeEntity])],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
