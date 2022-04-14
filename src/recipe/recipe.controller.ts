import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { RecipeService } from './recipe.service'
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RecipeRegisterInputDto } from './dtos/recipe.register.dto'
import { FilesInterceptor } from '@nestjs/platform-express'
import { multerOptions } from '../common/utils/multer.options'

@Controller('recipe')
@ApiTags('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('cookImages', 10, multerOptions('recipe-images')),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Recipe register' })
  @ApiBody({ type: RecipeRegisterInputDto })
  async register(
    @Body() recipeRegisterInputDto: RecipeRegisterInputDto,
    @UploadedFiles() cookImages: Array<Express.Multer.File>,
  ) {
    if (cookImages) {
      const path: string[] = []
      for (const image of cookImages) {
        path.push(
          `${process.env.HOST}:${process.env.PORT}/media/recipe-images/${image.filename}`,
        )
      }
      recipeRegisterInputDto.cookImages = [...path]
    }
  }
}
