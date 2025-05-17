import { Test, TestingModule } from '@nestjs/testing';
import { RosetteController } from './rosette.controller';

describe('RosetteController', () => {
  let rosetteController: RosetteController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RosetteController],
      providers: [],
    }).compile();

    rosetteController = app.get<RosetteController>(RosetteController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(rosetteController.aHello()).toBe('Hello World!');
    });
  });
});
