import { Test, TestingModule } from '@nestjs/testing'
import { RecipeService } from './recipe.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { RecipeEntity } from './entities/recipe.entity'
import { CategoryEntity } from './entities/category.entity'
import { Connection } from 'typeorm'
import { InternalServerErrorException } from '@nestjs/common'

class MockRecipeRepository {
  private readonly data = [{ id: 1, title: 'mock recipe!' }]

  findOne(id: number) {
    const recipePk = id['where']['pk']
    const recipe = this.data.find((recipe) => recipe.id === recipePk)
    if (!recipe) {
      return undefined
    }
    return recipe
  }
}
class MockCategoryRepository {}
class MockConnection {}

describe('recipe service', () => {
  let recipe: RecipeService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeService,
        {
          provide: getRepositoryToken(RecipeEntity),
          useClass: MockRecipeRepository,
        },
        {
          provide: getRepositoryToken(CategoryEntity),
          useClass: MockCategoryRepository,
        },
        {
          provide: Connection,
          useClass: MockConnection,
        },
      ],
    }).compile()

    recipe = module.get<RecipeService>(RecipeService)
  })

  it('should be defined recipe service', () => {
    expect(recipe).toBeDefined()
  })

  describe('get one', () => {
    it('should not found recipe', async () => {
      try {
        await expect(recipe.getOne({ pk: 2 })).resolves.toStrictEqual({
          access: false,
          message: 'Not found this recipe',
        })
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException)
      }
    })

    it('should success found recipe', async () => {
      try {
        await expect(recipe.getOne({ pk: 1 })).resolves.toStrictEqual({
          access: true,
          message: 'Success find recipe mock recipe!',
          recipe: {
            id: 1,
            title: 'mock recipe!',
          },
        })
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException)
      }
    })
  })
})
