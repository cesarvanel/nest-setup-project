import { Test, TestingModule } from '@nestjs/testing';
import { NodeAdapter } from '@nestjs/platform-node';
import type { NestNodeApplication } from '@nestjs/platform-node';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Session authentication (e2e)', () => {
  let app: NestNodeApplication;

  beforeAll(() => {
    process.env.AUTH_USERNAME = 'admin';
    process.env.AUTH_PASSWORD = 'secret';
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule.forRoot()],
    }).compile();

    app = moduleFixture.createNestApplication<NestNodeApplication>(
      new NodeAdapter(),
    );
    app.enableCsrfProtection();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/health is public', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  it('rejects protected routes without a session', () => {
    return request(app.getHttpServer()).get('/api/profile').expect(401);
  });

  it('rejects invalid credentials', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'wrong' })
      .expect(401);
  });

  it('signs in, reads the profile, then signs out', async () => {
    const agent = request.agent(app.getHttpServer());

    await agent.get('/api/session').expect(200).expect({ userId: null });

    const login = await agent
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'secret' })
      .expect(200)
      .expect({ userId: 'admin' });
    expect(login.headers['set-cookie']?.[0]).toMatch(/HttpOnly/i);

    await agent.get('/api/session').expect(200).expect({ userId: 'admin' });
    await agent
      .get('/api/profile')
      .expect(200)
      .expect((res) =>
        expect((res.body as { userId: string }).userId).toBe('admin'),
      );

    await agent.post('/api/auth/logout').expect(200).expect({ isLogout: true });
    await agent.get('/api/profile').expect(401);
  });

  it('refuses cross-site writes (CSRF)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .set('Sec-Fetch-Site', 'cross-site')
      .set('Origin', 'https://evil.example')
      .send({ username: 'admin', password: 'secret' })
      .expect(403);
  });
});
