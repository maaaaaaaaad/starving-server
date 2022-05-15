import {
  Controller,
  Delete,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from '../common/utils/multer.options'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { User } from '../common/decorators/user.decorator'
import { UserEntity } from '../auth/entities/user.entity'
import { AuthService } from '../auth/auth.service'
import { DeleteRecipeImageInputDto } from './dtos/delete.recipe.image.dto'
import { RecipeService } from '../recipe/recipe.service'

@Controller('upload')
@ApiTags('upload')
export class UploadController {
  constructor(
    private readonly authService: AuthService,
    private readonly recipeService: RecipeService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @UseInterceptors(FileInterceptor('image', multerOptions('images')))
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'To upload a single avatar image file',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadAvatarImage(
    @User() user: UserEntity,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const path = `${process.env.HOST}:${process.env.PORT}/media/images/${image.filename}`
    return await this.authService.avatarImageUpload(user.pk, path)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('recipe-image')
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'To Delete a single recipe image file',
    description: 'pk is recipePk',
  })
  async deleteRecipeImage(
    @User() owner: UserEntity,
    @Query() deleteRecipeImageInputDto: DeleteRecipeImageInputDto,
  ) {
    return await this.recipeService.deleteImage(
      owner,
      deleteRecipeImageInputDto,
    )
  }
}
