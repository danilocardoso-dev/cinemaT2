import { Test, TestingModule } from '@nestjs/testing';
import { IngressosService } from './ingressos.service';
import { PrismaService } from '../prisma/prisma.service';

describe('IngressosService', () => {
  let service: IngressosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngressosService,
        { provide: PrismaService, useValue: { ingresso: {}, sessao: {} } },
      ],
    }).compile();

    service = module.get<IngressosService>(IngressosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
