import { Test, TestingModule } from '@nestjs/testing'
import { RecipeService } from './recipe.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { RecipeEntity } from './entities/recipe.entity'
import { CategoryEntity, CategoryValues } from './entities/category.entity'
import { Connection, Repository } from 'typeorm'
import { RecipeRegisterInputDto } from './dtos/recipe.register.dto'

class MockRecipeRepository {}
class MockCategoryRepository {}
class MockConnection {}

describe('recipe service', () => {
  let recipeService: RecipeService

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

    recipeService = module.get<RecipeService>(RecipeService)
  })

  it('should be defined recipe service', () => {
    expect(recipeService).toBeDefined()
  })

  describe('register', () => {
    const owner = {
      pk: 1,
      email: 'mock@gmail.com',
      password: 'abcabc123123',
      nickname: 'mock',
      avatarImage: null,
      social: null,
    }
    const dto: RecipeRegisterInputDto = {
      title: 'mock',
      description: 'mock des',
      category: CategoryValues.RICE,
      mainText: 'mock text',
      cookImages: ['mock1', 'mock2'],
    }
  })
})
