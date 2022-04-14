import { Column, Entity, OneToMany } from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { RecipeEntity } from './recipe.entity'

export enum CategoryValues {
  RICE = 'RICE',
  SOUP = 'SOUP',
  BREAD = 'BREAD',
  NOODLE = 'NOODLE',
  FRIED = 'FRIED',
}

@Entity({ name: 'CATEGORY' })
export class CategoryEntity extends CoreEntity {
  @Column({ name: 'CATEGORY', enum: CategoryValues, nullable: false })
  @IsEnum(CategoryValues)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Category values',
    enum: CategoryValues,
    nullable: false,
    required: true,
  })
  category: CategoryValues

  @OneToMany(() => RecipeEntity, (recipe) => recipe.category)
  recipes: RecipeEntity[]
}
