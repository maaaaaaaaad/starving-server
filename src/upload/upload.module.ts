import { Module } from '@nestjs/common'
import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'
import { AuthModule } from '../auth/auth.module'
import { RecipeModule } from '../recipe/recipe.module'

@Module({
  imports: [AuthModule, RecipeModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
