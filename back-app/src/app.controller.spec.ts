import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should return health status', () => {
    expect(appController.health()).toEqual({ status: 'ok' });
  });

  it('should return the signed-in user id, or null', () => {
    expect(appController.session({ id: 'admin' })).toEqual({ userId: 'admin' });
    expect(appController.session(null)).toEqual({ userId: null });
  });
});
