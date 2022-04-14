import { Module } from '@nestjs/common'
import { RecipeController } from './recipe.controller'
import { RecipeService } from './recipe.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RecipeEntity } from './entities/recipe.entity'
import { CategoryEntity } from './entities/category.entity'

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity, CategoryEntity])],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
