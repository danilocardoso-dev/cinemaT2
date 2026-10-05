import { ConflictException, Injectable } from '@nestjs/common';
import { CreateItensPedidoLancheDto } from './dto/create-itens_pedido_lanche.dto';
import { UpdateItensPedidoLancheDto } from './dto/update-itens_pedido_lanche.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ItensPedidoLancheService {
  constructor(private readonly prisma: PrismaService) {}

  create(createItensPedidoLancheDto: CreateItensPedidoLancheDto) {
    return this.prisma.$transaction(async (tx) => {
      const [, lanche] = await Promise.all([
        tx.pedido.findUniqueOrThrow({
          where: { id: createItensPedidoLancheDto.pedidoId },
        }),
        tx.lanche.findUniqueOrThrow({
          where: { id: createItensPedidoLancheDto.lancheId },
        }),
      ]);

      this.validarEstoque(
        lanche.ativo,
        lanche.qtUnidade,
        createItensPedidoLancheDto.quantidade,
      );

      const subtotal = this.roundMoney(
        lanche.valorUnitario * createItensPedidoLancheDto.quantidade,
      );

      const estoqueAtualizado = await tx.lanche.updateMany({
        where: {
          id: lanche.id,
          ativo: true,
          qtUnidade: { gte: createItensPedidoLancheDto.quantidade },
        },
        data: {
          qtUnidade: { decrement: createItensPedidoLancheDto.quantidade },
        },
      });
      if (estoqueAtualizado.count !== 1) {
        throw new ConflictException(
          'O estoque do lanche foi alterado. Verifique a quantidade disponível.',
        );
      }

      const item = await tx.itemPedidoLanche.create({
        data: {
          pedidoId: createItensPedidoLancheDto.pedidoId,
          lancheId: createItensPedidoLancheDto.lancheId,
          quantidade: createItensPedidoLancheDto.quantidade,
          valorUnitario: lanche.valorUnitario,
          subtotal,
        },
        include: { lanche: true },
      });

      await tx.pedido.update({
        where: { id: createItensPedidoLancheDto.pedidoId },
        data: { valorTotal: { increment: subtotal } },
      });

      return item;
    });
  }

  findAll() {
    return this.prisma.itemPedidoLanche.findMany({
      include: { lanche: true, pedido: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.itemPedidoLanche.findUniqueOrThrow({
      where: { id },
      include: { lanche: true, pedido: true },
    });
  }

  update(id: number, dto: UpdateItensPedidoLancheDto) {
    return this.prisma.$transaction(async (tx) => {
      const atual = await tx.itemPedidoLanche.findUniqueOrThrow({
        where: { id },
      });
      const pedidoId = dto.pedidoId ?? atual.pedidoId;
      const lancheId = dto.lancheId ?? atual.lancheId;
      const quantidade = dto.quantidade ?? atual.quantidade;

      const lancheDestino = await tx.lanche.findUniqueOrThrow({
        where: { id: lancheId },
      });
      const estoqueDisponivel =
        lancheId === atual.lancheId
          ? lancheDestino.qtUnidade + atual.quantidade
          : lancheDestino.qtUnidade;
      this.validarEstoque(lancheDestino.ativo, estoqueDisponivel, quantidade);

      await Promise.all([
        tx.pedido.findUniqueOrThrow({ where: { id: atual.pedidoId } }),
        pedidoId === atual.pedidoId
          ? tx.pedido.findUniqueOrThrow({ where: { id: atual.pedidoId } })
          : tx.pedido.findUniqueOrThrow({ where: { id: pedidoId } }),
      ]);

      const subtotal = this.roundMoney(
        lancheDestino.valorUnitario * quantidade,
      );

      if (lancheId === atual.lancheId) {
        const diferenca = quantidade - atual.quantidade;
        if (diferenca > 0) {
          const estoqueAtualizado = await tx.lanche.updateMany({
            where: {
              id: lancheId,
              ativo: true,
              qtUnidade: { gte: diferenca },
            },
            data: { qtUnidade: { decrement: diferenca } },
          });
          if (estoqueAtualizado.count !== 1) {
            throw new ConflictException(
              'O estoque do lanche foi alterado. Verifique a quantidade disponível.',
            );
          }
        } else if (diferenca < 0) {
          await tx.lanche.update({
            where: { id: lancheId },
            data: { qtUnidade: { increment: -diferenca } },
          });
        }
      } else {
        await tx.lanche.update({
          where: { id: atual.lancheId },
          data: { qtUnidade: { increment: atual.quantidade } },
        });
        const estoqueAtualizado = await tx.lanche.updateMany({
          where: {
            id: lancheId,
            ativo: true,
            qtUnidade: { gte: quantidade },
          },
          data: { qtUnidade: { decrement: quantidade } },
        });
        if (estoqueAtualizado.count !== 1) {
          throw new ConflictException(
            'O estoque do lanche foi alterado. Verifique a quantidade disponível.',
          );
        }
      }

      if (pedidoId === atual.pedidoId) {
        await tx.pedido.update({
          where: { id: pedidoId },
          data: {
            valorTotal: {
              increment: this.roundMoney(subtotal - atual.subtotal),
            },
          },
        });
      } else {
        await Promise.all([
          tx.pedido.update({
            where: { id: atual.pedidoId },
            data: { valorTotal: { decrement: atual.subtotal } },
          }),
          tx.pedido.update({
            where: { id: pedidoId },
            data: { valorTotal: { increment: subtotal } },
          }),
        ]);
      }

      return tx.itemPedidoLanche.update({
        where: { id },
        data: {
          pedidoId,
          lancheId,
          quantidade,
          valorUnitario: lancheDestino.valorUnitario,
          subtotal,
        },
        include: { lanche: true, pedido: true },
      });
    });
  }

  remove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.itemPedidoLanche.findUniqueOrThrow({
        where: { id },
      });
      await tx.pedido.findUniqueOrThrow({
        where: { id: item.pedidoId },
      });

      const removido = await tx.itemPedidoLanche.delete({ where: { id } });
      await Promise.all([
        tx.lanche.update({
          where: { id: item.lancheId },
          data: { qtUnidade: { increment: item.quantidade } },
        }),
        tx.pedido.update({
          where: { id: item.pedidoId },
          data: { valorTotal: { decrement: item.subtotal } },
        }),
      ]);

      return removido;
    });
  }

  private validarEstoque(
    ativo: boolean,
    estoqueDisponivel: number,
    quantidade: number,
  ) {
    if (!ativo) {
      throw new ConflictException('O lanche está inativo.');
    }
    if (estoqueDisponivel < quantidade) {
      throw new ConflictException('Estoque insuficiente para este lanche.');
    }
  }

  private roundMoney(valor: number) {
    return Math.round(valor * 100) / 100;
  }
}
