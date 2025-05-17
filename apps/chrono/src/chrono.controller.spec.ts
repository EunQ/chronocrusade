import { Test, TestingModule } from '@nestjs/testing';
import { ChronoController } from './chrono.controller';
import { ChronoService } from './chrono.service';

describe('ChronoController', () => {
  let chronoController: ChronoController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ChronoController],
      providers: [ChronoService],
    }).compile();

    chronoController = app.get<ChronoController>(ChronoController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(chronoController.getHello()).toBe('Hello World!');
    });
  });
});
