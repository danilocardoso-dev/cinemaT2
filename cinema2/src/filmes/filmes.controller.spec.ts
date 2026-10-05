import { Test, TestingModule } from '@nestjs/testing';
import { FilmesController } from './filmes.controller';
import { FilmesService } from './filmes.service';

describe('FilmesController', () => {
  let controller: FilmesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmesController],
      providers: [{ provide: FilmesService, useValue: {} }],
    }).compile();

    controller = module.get<FilmesController>(FilmesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
