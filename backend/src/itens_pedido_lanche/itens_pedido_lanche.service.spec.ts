import { Test, TestingModule } from '@nestjs/testing';
import { ItensPedidoLancheService } from './itens_pedido_lanche.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ItensPedidoLancheService', () => {
  let service: ItensPedidoLancheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItensPedidoLancheService,
        { provide: PrismaService, useValue: { itemPedidoLanche: {} } },
      ],
    }).compile();

    service = module.get<ItensPedidoLancheService>(ItensPedidoLancheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
