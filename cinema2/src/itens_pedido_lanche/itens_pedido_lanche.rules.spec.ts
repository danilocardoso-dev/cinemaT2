import { PrismaService } from '../prisma/prisma.service';
import { ItensPedidoLancheService } from './itens_pedido_lanche.service';

describe('ItensPedidoLancheService rules', () => {
  it('usa preço do banco, calcula subtotal e baixa estoque', async () => {
    const tx = {
      pedido: {
        findUniqueOrThrow: jest.fn().mockResolvedValue({
          id: 1,
          valorTotal: 10,
        }),
        update: jest.fn().mockResolvedValue({}),
      },
      lanche: {
        findUniqueOrThrow: jest.fn().mockResolvedValue({
          id: 2,
          ativo: true,
          qtUnidade: 8,
          valorUnitario: 7.5,
        }),
        update: jest.fn().mockResolvedValue({}),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      itemPedidoLanche: {
        create: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({
            ...data,
            id: 3,
          }),
        ),
      },
    };
    const prisma = {
      $transaction: jest.fn(
        (callback: (client: typeof tx) => Promise<unknown>) => callback(tx),
      ),
    } as unknown as PrismaService;
    const service = new ItensPedidoLancheService(prisma);

    const item = await service.create({
      pedidoId: 1,
      lancheId: 2,
      quantidade: 3,
    });

    expect(item).toEqual(
      expect.objectContaining({ valorUnitario: 7.5, subtotal: 22.5 }),
    );
    expect(tx.lanche.updateMany).toHaveBeenCalledWith({
      where: { id: 2, ativo: true, qtUnidade: { gte: 3 } },
      data: { qtUnidade: { decrement: 3 } },
    });
    expect(tx.pedido.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { valorTotal: { increment: 22.5 } },
      }),
    );
  });
});
