import { Test, TestingModule } from '@nestjs/testing'
import { RecipeService } from './recipe.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { RecipeEntity } from './entities/recipe.entity'
import { CategoryEntity } from './entities/category.entity'
import { Connection, Repository } from 'typeorm'

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>

describe('RecipeService', () => {
  let service: RecipeService
  let recipeRepository: MockRepository<RecipeEntity>
  let categoryRepository: MockRepository<CategoryEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeService,
        {
          provide: getRepositoryToken(RecipeEntity),
          useValue: {
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: Connection,
          useValue: {
            createQueryRunner: jest.fn(),
            connect: jest.fn(),
            startTransaction: jest.fn(),
            getRepository: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
          },
        },
      ],
    }).compile()
    service = module.get<RecipeService>(RecipeService)
    recipeRepository = module.get(getRepositoryToken(RecipeEntity))
    categoryRepository = module.get(getRepositoryToken(CategoryEntity))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
    expect(recipeRepository).toBeDefined()
    expect(categoryRepository).toBeDefined()
  })
})
