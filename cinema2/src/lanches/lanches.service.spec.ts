import { Test, TestingModule } from '@nestjs/testing';
import { LanchesService } from './lanches.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LanchesService', () => {
  let service: LanchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LanchesService,
        { provide: PrismaService, useValue: { lanche: {} } },
      ],
    }).compile();

    service = module.get<LanchesService>(LanchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
