import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Application, Framework } from '@midwayjs/koa';

let app: Application;

beforeAll(async () => {
  // create app
  app = await createApp<Framework>();

  // make request
  await createHttpRequest(app)
    .post('/api/user/register')
    .send({
      username: 'jack',
      password: 'redballoon',
    });
});

afterAll(async () => {
  await close(app);
});

describe('test/controller/user.controller.ts', () => {
  it('should POST /api/user/login', async () => {
    // make request
    const result = await createHttpRequest(app)
      .post('/api/user/login')
      .send({ username: 'jack', password: 'redballoon' });

    // use expect by jest
    expect(result.status).toBe(200);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('登录成功');

  });

  it('should POST /api/user/login', async () => {
    // make request
    const result = await createHttpRequest(app)
      .post('/api/user/login')
      .send({ username: 'jack', password: 'wrongPWD' });

    // use expect by jest
    expect(result.status).toBe(200);
    expect(result.body.code).toBe(400);
    expect(result.body.message).toBe('账号或密码不正确');
  });
});
