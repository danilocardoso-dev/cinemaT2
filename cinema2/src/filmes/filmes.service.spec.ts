import { Test, TestingModule } from '@nestjs/testing';
import { FilmesService } from './filmes.service';
import { PrismaService } from '../prisma/prisma.service';

describe('FilmesService', () => {
  let service: FilmesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmesService,
        { provide: PrismaService, useValue: { filme: {} } },
      ],
    }).compile();

    service = module.get<FilmesService>(FilmesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
