import { Test, TestingModule } from '@nestjs/testing';
import { ItensPedidoLancheService } from './itens_pedido_lanche.service';

describe('ItensPedidoLancheService', () => {
  let service: ItensPedidoLancheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItensPedidoLancheService],
    }).compile();

    service = module.get<ItensPedidoLancheService>(ItensPedidoLancheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
