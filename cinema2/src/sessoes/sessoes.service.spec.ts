import { Test, TestingModule } from '@nestjs/testing';
import { SessoesService } from './sessoes.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SessoesService', () => {
  let service: SessoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessoesService,
        { provide: PrismaService, useValue: { sessao: {} } },
      ],
    }).compile();

    service = module.get<SessoesService>(SessoesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
