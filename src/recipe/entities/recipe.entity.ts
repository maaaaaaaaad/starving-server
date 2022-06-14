import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { CategoryEntity } from './category.entity'
import { UserEntity } from '../../auth/entities/user.entity'
import { CommentEntity } from '../../comment/entities/comment.entity'
import { LikeEntity } from '../../like/entities/like.entity'

@Entity({ name: 'Recipe' })
export class RecipeEntity extends CoreEntity {
  @Column({ name: 'TITLE', type: String, nullable: false })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Recipe title',
    type: String,
    nullable: false,
    required: true,
  })
  title: string

  @Column({ name: 'DESCRIPTION', type: String, nullable: false })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Recipe description',
    type: String,
    nullable: false,
    required: true,
  })
  description: string

  @Column({ name: 'MAIN_TEXT', type: String, nullable: false })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Cook main text field',
    nullable: false,
    required: true,
  })
  mainText: string

  @Column({ name: 'COOK_IMAGES', type: 'json', nullable: false })
  @IsNotEmpty()
  @ApiProperty({
    description: 'Cook images max count 10',
    nullable: false,
    required: true,
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  cookImages: string[]

  @ManyToOne(() => CategoryEntity, (category) => category.recipes)
  category: CategoryEntity

  @ManyToOne(() => UserEntity, (owner) => owner.recipes, {
    onDelete: 'CASCADE',
  })
  owner: UserEntity

  @OneToMany(() => CommentEntity, (comment) => comment.recipe)
  comments: CommentEntity[]

  @OneToMany(() => LikeEntity, (likes) => likes.recipe)
  likes: LikeEntity[]

  @Column({ name: 'LIKES_COUNT', type: Number, nullable: true, default: 0 })
  likesCount?: number

  @RelationId((recipe: RecipeEntity) => recipe.owner)
  ownerId: number
}
