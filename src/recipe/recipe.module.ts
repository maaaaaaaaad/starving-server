import { Module } from '@nestjs/common'
import { RecipeController } from './recipe.controller'
import { RecipeService } from './recipe.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RecipeEntity } from './entities/recipe.entity'

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity])],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
