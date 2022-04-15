import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { RecipeService } from './recipe.service'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { RecipeRegisterInputDto } from './dtos/recipe.register.dto'
import { FilesInterceptor } from '@nestjs/platform-express'
import { multerOptions } from '../common/utils/multer.options'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { User } from '../common/decorators/user.decorator'
import { UserEntity } from '../auth/entities/user.entity'
import { RecipeGetAllInputDto } from './dtos/recipe.get.all.dto'
import { RecipeGetOneInputDto } from './dtos/recipe.get.one.dto'
import { RecipeGetMyInputDto } from './dtos/recipe.get.my.dto'
import { RecipeGetCategoryInputDto } from './dtos/recipe.get.category.dto'
import { RecipeUpdateInputDto } from './dtos/recipe.update.dto'
import { RecipeDeleteInputDto } from './dtos/recipe.delete.dto'

@Controller('recipe')
@ApiTags('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FilesInterceptor('cookImages', 10, multerOptions('recipe-images')),
  )
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Recipe register' })
  @ApiBody({ type: RecipeRegisterInputDto })
  async register(
    @Body() recipeRegisterInputDto: RecipeRegisterInputDto,
    @UploadedFiles() cookImages: Array<Express.Multer.File>,
    @User() owner: UserEntity,
  ) {
    if (cookImages) {
      const path: string[] = []
      for (const image of cookImages) {
        path.push(
          `${process.env.HOST}:${process.env.PORT}/media/recipe-images/${image.filename}`,
        )
      }
      recipeRegisterInputDto.cookImages = [...path]
      return await this.recipeService.register(owner, recipeRegisterInputDto)
    }
    throw new HttpException('Required cook images', HttpStatus.BAD_REQUEST)
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all recipes' })
  async getAll(@Query() recipeGetAllInputDto: RecipeGetAllInputDto) {
    return await this.recipeService.getAll(recipeGetAllInputDto)
  }

  @Get('one')
  @ApiOperation({ summary: 'Get one recipe' })
  async getOne(@Query() recipeGetOneInputDto: RecipeGetOneInputDto) {
    return await this.recipeService.getOne(recipeGetOneInputDto)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('my')
  @ApiOperation({ summary: 'Get my recipes' })
  async getMy(
    @User() owner: UserEntity,
    @Query() recipeGetMyInputDto: RecipeGetMyInputDto,
  ) {
    return await this.recipeService.getMy(owner, recipeGetMyInputDto)
  }

  @Get('category')
  @ApiOperation({ summary: 'Get recipes by category value' })
  async getByCategory(
    @Query() recipeGetCategoryInputDto: RecipeGetCategoryInputDto,
  ) {
    return await this.recipeService.getByCategory(recipeGetCategoryInputDto)
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @UseInterceptors(
    FilesInterceptor('cookImages', 10, multerOptions('recipe-images')),
  )
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update my recipe' })
  @ApiBody({ type: RecipeUpdateInputDto })
  async update(
    @Body() recipeUpdateInputDto: RecipeUpdateInputDto,
    @UploadedFiles() cookImages: Array<Express.Multer.File>,
    @User() owner: UserEntity,
  ) {
    if (cookImages) {
      const path: string[] = []
      for (const image of cookImages) {
        path.push(
          `${process.env.HOST}:${process.env.PORT}/media/recipe-images/${image.filename}`,
        )
      }
      recipeUpdateInputDto.cookImages = [...path]
      return await this.recipeService.update(owner, recipeUpdateInputDto)
    }
    throw new HttpException('Required cook images', HttpStatus.BAD_REQUEST)
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete my recipe' })
  async delete(
    @User() owner: UserEntity,
    @Query() recipeDeleteInputDto: RecipeDeleteInputDto,
  ) {
    return await this.recipeService.delete(owner, recipeDeleteInputDto)
  }
}
