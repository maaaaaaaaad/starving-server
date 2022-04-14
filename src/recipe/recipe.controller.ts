import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
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
}
