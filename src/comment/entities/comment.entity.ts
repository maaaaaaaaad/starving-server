import { Column, Entity, ManyToOne, RelationId } from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { UserEntity } from '../../auth/entities/user.entity'
import { RecipeEntity } from '../../recipe/entities/recipe.entity'

@Entity({ name: 'Comment' })
export class CommentEntity extends CoreEntity {
  @Column({ name: 'CONTENT', type: String, nullable: false })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User comment',
    nullable: false,
    required: true,
    example: 'Hello World!',
    type: String,
  })
  content: string

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  owner: UserEntity

  @RelationId((comment: CommentEntity) => comment.owner)
  ownerPk

  @ManyToOne(() => RecipeEntity, (recipe) => recipe.comments, {
    onDelete: 'CASCADE',
  })
  recipe: RecipeEntity
}
