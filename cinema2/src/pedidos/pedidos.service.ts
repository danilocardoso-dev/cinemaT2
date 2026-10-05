import { Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StatusPedido } from '../generated/prisma/client';

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPedidoDto: CreatePedidoDto) {
    return this.prisma.pedido.create({
      data: {
        usuarioId: createPedidoDto.usuarioId,
        qtInteira: 0,
        qtMeia: 0,
        valorTotal: 0,
        status: StatusPedido.PENDENTE,
      },
    });
  }

  findAll() {
    return this.prisma.pedido.findMany({
      include: { usuario: { select: { id: true, nome: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.pedido.findUniqueOrThrow({
      where: { id },
      include: {
        usuario: { select: { id: true, nome: true, email: true } },
        ingressos: true,
        lanches: { include: { lanche: true } },
      },
    });
  }

  update(id: number, updatePedidoDto: UpdatePedidoDto) {
    return this.prisma.pedido.update({
      where: { id },
      data: updatePedidoDto,
    });
  }

  remove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.findUniqueOrThrow({
        where: { id },
        include: {
          lanches: { select: { lancheId: true, quantidade: true } },
        },
      });

      const quantidadesPorLanche = new Map<number, number>();
      for (const item of pedido.lanches) {
        quantidadesPorLanche.set(
          item.lancheId,
          (quantidadesPorLanche.get(item.lancheId) ?? 0) + item.quantidade,
        );
      }

      await Promise.all(
        [...quantidadesPorLanche].map(([lancheId, quantidade]) =>
          tx.lanche.update({
            where: { id: lancheId },
            data: { qtUnidade: { increment: quantidade } },
          }),
        ),
      );

      return tx.pedido.delete({ where: { id } });
    });
  }
}
