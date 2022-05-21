import { Test, TestingModule } from '@nestjs/testing'
import { RecipeService } from './recipe.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { RecipeEntity } from './entities/recipe.entity'
import { CategoryEntity } from './entities/category.entity'
import { Connection } from 'typeorm'

class MockRecipeRepository {}
class MockCategoryRepository {}

describe('recipe service', () => {
  let recipeService: RecipeService
  let connection: Connection

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
          useValue: {
            createQueryRunner: jest.fn(() => ({
              connect: jest.fn(),
              startTransaction: jest.fn(),
            })),
          },
        },
      ],
    }).compile()

    recipeService = module.get<RecipeService>(RecipeService)
    connection = module.get<Connection>(Connection)
  })

  it('should be defined recipe service', () => {
    expect(recipeService).toBeDefined()
  })

  it('should be defined connection', () => {
    expect(connection).toBeDefined()
  })
})
