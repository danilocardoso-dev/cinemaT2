import { Test, TestingModule } from '@nestjs/testing';
import { LanchesService } from './lanches.service';

describe('LanchesService', () => {
  let service: LanchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LanchesService],
    }).compile();

    service = module.get<LanchesService>(LanchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
