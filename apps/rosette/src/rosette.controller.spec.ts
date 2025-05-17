import { Test, TestingModule } from '@nestjs/testing';
import { RosetteController } from './rosette.controller';
import { RosetteService } from './rosette.service';

describe('RosetteController', () => {
  let rosetteController: RosetteController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RosetteController],
      providers: [RosetteService],
    }).compile();

    rosetteController = app.get<RosetteController>(RosetteController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(rosetteController.getHello()).toBe('Hello World!');
    });
  });
});
