import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { UserRegisterInputDto } from '../src/auth/dtos/user.register.dto'
import { UserLoginInputDto } from '../src/auth/dtos/user.login.dto'
import { UserUpdateInputDto } from '../src/auth/dtos/user.update.dto'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let token: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()
  })

  afterAll(async () => {
    const res = await request(app.getHttpServer())
      .delete('/auth')
      .set('Authorization', `Bearer ${token}`)
    expect(res.body).toMatchObject({
      access: true,
      message: 'Delete this user account',
    })
  })

  describe('auth', () => {
    describe('register', () => {
      const dto: UserRegisterInputDto = {
        email: 'mad@gmail.com',
        password: 'abcabc123123',
        nickname: 'mad',
        social: null,
        avatarImage: null,
      }
      const url = '/auth/register'
      it('should success', async () => {
        const res = await request(app.getHttpServer())
          .post(url)
          .send(dto)
          .expect(201)
        expect(res.body).toMatchObject({
          access: true,
          success: 'Success register user account',
        })
      })

      it('should fail if the email exists', async () => {
        const res = await request(app.getHttpServer())
          .post(url)
          .send(dto)
          .expect(201)
        expect(res.body).toMatchObject({
          access: false,
          message: 'This email already to exists',
        })
      })
    })

    describe('login', () => {
      const dto: UserLoginInputDto = {
        email: 'mad@gmail.com',
        password: 'abcabc123123',
      }
      const url = '/auth/login'
      it('should success', async () => {
        const res = await request(app.getHttpServer())
          .post(url)
          .send(dto)
          .expect(201)
        token = res.body.token
        expect(token).toEqual(expect.any(String))
      })

      it('should fail if the not found user', async () => {
        const res = await request(app.getHttpServer())
          .post(url)
          .send({ email: 'sdofijesf@gmail.com', password: 'weofij123123' })
          .expect(201)
        expect(res.body).toMatchObject({
          access: false,
          error: 'Not found this user',
        })
      })

      it('should fail if the wrong password', async () => {
        const res = await request(app.getHttpServer())
          .post(url)
          .send({ email: 'mad@gmail.com', password: 'weofij123123' })
          .expect(201)
        expect(res.body).toMatchObject({
          access: false,
          error: 'No match password',
        })
      })
    })

    describe('user', () => {
      it('should get current user', async () => {
        const res = await request(app.getHttpServer())
          .get('/auth')
          .set('Authorization', `Bearer ${token}`)
        expect(res.body).toMatchObject({})
      })

      it('should fail get current user if the wrong token', async () => {
        const res = await request(app.getHttpServer())
          .get('/auth')
          .set('Authorization', `Bearer MockToken`)
        expect(res.body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        })
      })
    })

    describe('update', () => {
      const userUpdateInputDto: UserUpdateInputDto = {
        nickname: 'TEST_MAD',
        password: 'soejfsoeijf123123',
      }
      it('should update', async () => {
        const res = await request(app.getHttpServer())
          .patch('/auth')
          .send(userUpdateInputDto)
          .set('Authorization', `Bearer ${token}`)
        expect(res.body).toMatchObject({
          access: true,
          message: 'Success update profile',
          user: expect.any(Object),
        })
      })

      it('should update the only nickname', async () => {
        const res = await request(app.getHttpServer())
          .patch('/auth')
          .send(userUpdateInputDto.nickname)
          .set('Authorization', `Bearer ${token}`)
        expect(res.body).toMatchObject({
          access: true,
          message: 'Success update profile',
          user: expect.any(Object),
        })
      })

      it('should update the only password', async () => {
        const res = await request(app.getHttpServer())
          .patch('/auth')
          .send(userUpdateInputDto.password)
          .set('Authorization', `Bearer ${token}`)
        expect(res.body).toMatchObject({
          access: true,
          message: 'Success update profile',
          user: expect.any(Object),
        })
      })

      it('should fail update not a token', async () => {
        const res = await request(app.getHttpServer())
          .patch('/auth')
          .send(userUpdateInputDto)
          .set('Authorization', `Bearer MockToken`)
        expect(res.body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        })
      })
    })
  })
})
