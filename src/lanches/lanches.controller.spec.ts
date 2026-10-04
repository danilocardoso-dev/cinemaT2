import { Test, TestingModule } from '@nestjs/testing';
import { LanchesController } from './lanches.controller';
import { LanchesService } from './lanches.service';

describe('LanchesController', () => {
  let controller: LanchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LanchesController],
      providers: [LanchesService],
    }).compile();

    controller = module.get<LanchesController>(LanchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
