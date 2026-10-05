import { Test, TestingModule } from '@nestjs/testing';
import { ItensPedidoLancheController } from './itens_pedido_lanche.controller';
import { ItensPedidoLancheService } from './itens_pedido_lanche.service';

describe('ItensPedidoLancheController', () => {
  let controller: ItensPedidoLancheController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItensPedidoLancheController],
      providers: [{ provide: ItensPedidoLancheService, useValue: {} }],
    }).compile();

    controller = module.get<ItensPedidoLancheController>(
      ItensPedidoLancheController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
