import { PrismaService } from '../prisma/prisma.service';
import { PedidosService } from './pedidos.service';

describe('PedidosService rules', () => {
  it('devolve ao estoque os lanches quando o pedido é excluído', async () => {
    const tx = {
      pedido: {
        findUniqueOrThrow: jest.fn().mockResolvedValue({
          id: 1,
          lanches: [
            { lancheId: 2, quantidade: 2 },
            { lancheId: 2, quantidade: 3 },
            { lancheId: 3, quantidade: 1 },
          ],
        }),
        delete: jest.fn().mockResolvedValue({ id: 1 }),
      },
      lanche: {
        update: jest.fn().mockResolvedValue({}),
      },
    };
    const prisma = {
      $transaction: jest.fn(
        (callback: (client: typeof tx) => Promise<unknown>) => callback(tx),
      ),
    } as unknown as PrismaService;
    const service = new PedidosService(prisma);

    await service.remove(1);

    expect(tx.lanche.update).toHaveBeenCalledTimes(2);
    expect(tx.lanche.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { qtUnidade: { increment: 5 } },
    });
    expect(tx.lanche.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: { qtUnidade: { increment: 1 } },
    });
    expect(tx.pedido.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
