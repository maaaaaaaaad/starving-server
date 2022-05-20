import { Test, TestingModule } from '@nestjs/testing'
import { RecipeService } from './recipe.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { RecipeEntity } from './entities/recipe.entity'
import { CategoryEntity } from './entities/category.entity'
import { Connection } from 'typeorm'

describe('RecipeService', () => {
  let service: RecipeService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeService,
        {
          provide: getRepositoryToken(RecipeEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: Connection,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile()
    service = module.get<RecipeService>(RecipeService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
