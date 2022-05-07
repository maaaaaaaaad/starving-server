import { Entity, ManyToOne } from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import { UserEntity } from '../../auth/entities/user.entity'
import { RecipeEntity } from '../../recipe/entities/recipe.entity'

@Entity({ name: 'Like' })
export class LikeEntity extends CoreEntity {
  @ManyToOne(() => UserEntity, (owner) => owner.likes, {
    onDelete: 'CASCADE',
  })
  owner: UserEntity

  @ManyToOne(() => RecipeEntity, (recipe) => recipe.likes, {
    onDelete: 'CASCADE',
  })
  recipe: RecipeEntity
}
