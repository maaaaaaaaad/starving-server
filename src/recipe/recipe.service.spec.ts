import { Test, TestingModule } from '@nestjs/testing'
import { RecipeService } from './recipe.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { RecipeEntity } from './entities/recipe.entity'
import { CategoryEntity } from './entities/category.entity'
import { Connection, Repository } from 'typeorm'

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>

describe('recipe service', () => {
  let recipeService: RecipeService
  let connection: Connection
  let recipeRepository: MockRepository<RecipeEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeService,
        {
          provide: getRepositoryToken(RecipeEntity),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: Connection,
          useFactory: () => ({
            createQueryRunner: () => ({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              manager: {
                save: (r) => r,
                getRepository: jest.fn(() => ({
                  create: jest.fn().mockReturnThis(),
                })),
              },
            }),
          }),
        },
      ],
    }).compile()

    recipeService = module.get<RecipeService>(RecipeService)
    connection = module.get<Connection>(Connection)
    recipeRepository = module.get(getRepositoryToken(RecipeEntity))
  })

  it('should be defined recipe service', () => {
    expect(recipeService).toBeDefined()
  })

  it('should be defined connection', () => {
    expect(connection).toBeDefined()
  })
})
