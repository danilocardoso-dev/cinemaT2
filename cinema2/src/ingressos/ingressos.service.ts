import { ConflictException, Injectable } from '@nestjs/common';
import { CreateIngressoDto } from './dto/create-ingresso.dto';
import { UpdateIngressoDto } from './dto/update-ingresso.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TipoIngresso } from '../generated/prisma/client';
@Injectable()
export class IngressosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createIngressoDto: CreateIngressoDto) {
    const sessao = await this.prisma.sessao.findUniqueOrThrow({
      where: { id: createIngressoDto.sessaoId },
      include: { sala: true, _count: { select: { ingressos: true } } },
    });

    if (sessao._count.ingressos >= sessao.sala.capacidade) {
      throw new ConflictException('A sessão já atingiu a capacidade da sala.');
    }

    await this.ensureAssentoDisponivel(
      createIngressoDto.sessaoId,
      createIngressoDto.assento,
    );

    const valor = this.calcularValor(sessao.precoBase, createIngressoDto.tipo);
    const createArgs = {
      data: {
        ...createIngressoDto,
        valor,
      },
      include: { sessao: true, pedido: true } as const,
    };

    if (!createIngressoDto.pedidoId) {
      return this.prisma.ingresso.create(createArgs);
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.pedido.findUniqueOrThrow({
        where: { id: createIngressoDto.pedidoId },
      });
      const ingresso = await tx.ingresso.create(createArgs);
      await tx.pedido.update({
        where: { id: createIngressoDto.pedidoId },
        data: {
          valorTotal: { increment: valor },
          qtInteira:
            createIngressoDto.tipo === TipoIngresso.inteira
              ? { increment: 1 }
              : undefined,
          qtMeia:
            createIngressoDto.tipo === TipoIngresso.meia
              ? { increment: 1 }
              : undefined,
        },
      });
      return ingresso;
    });
  }

  findAll() {
    return this.prisma.ingresso.findMany({
      include: { sessao: true, pedido: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.ingresso.findUniqueOrThrow({
      where: { id },
      include: { sessao: true, pedido: true },
    });
  }

  async update(id: number, updateIngressoDto: UpdateIngressoDto) {
    const atual = await this.prisma.ingresso.findUniqueOrThrow({
      where: { id },
    });
    const sessaoId = updateIngressoDto.sessaoId ?? atual.sessaoId;
    const sessao = await this.prisma.sessao.findUniqueOrThrow({
      where: { id: sessaoId },
      include: { sala: true, _count: { select: { ingressos: true } } },
    });

    if (
      sessaoId !== atual.sessaoId &&
      sessao._count.ingressos >= sessao.sala.capacidade
    ) {
      throw new ConflictException('A sessão já atingiu a capacidade da sala.');
    }

    await this.ensureAssentoDisponivel(
      sessaoId,
      updateIngressoDto.assento ?? atual.assento ?? undefined,
      id,
    );

    const tipo = updateIngressoDto.tipo ?? atual.tipo;
    const pedidoId = updateIngressoDto.pedidoId ?? atual.pedidoId;
    const valor = this.calcularValor(sessao.precoBase, tipo);

    return this.prisma.$transaction(async (tx) => {
      if (pedidoId) {
        await tx.pedido.findUniqueOrThrow({ where: { id: pedidoId } });
      }

      const ingresso = await tx.ingresso.update({
        where: { id },
        data: {
          ...updateIngressoDto,
          valor,
        },
        include: { sessao: true, pedido: true },
      });

      if (atual.pedidoId) {
        await tx.pedido.update({
          where: { id: atual.pedidoId },
          data: {
            valorTotal: { decrement: atual.valor },
            qtInteira:
              atual.tipo === TipoIngresso.inteira
                ? { decrement: 1 }
                : undefined,
            qtMeia:
              atual.tipo === TipoIngresso.meia ? { decrement: 1 } : undefined,
          },
        });
      }

      if (pedidoId) {
        await tx.pedido.update({
          where: { id: pedidoId },
          data: {
            valorTotal: { increment: valor },
            qtInteira:
              tipo === TipoIngresso.inteira ? { increment: 1 } : undefined,
            qtMeia: tipo === TipoIngresso.meia ? { increment: 1 } : undefined,
          },
        });
      }

      return ingresso;
    });
  }

  remove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const ingresso = await tx.ingresso.findUniqueOrThrow({ where: { id } });
      const removido = await tx.ingresso.delete({ where: { id } });

      if (ingresso.pedidoId) {
        await tx.pedido.update({
          where: { id: ingresso.pedidoId },
          data: {
            valorTotal: { decrement: ingresso.valor },
            qtInteira:
              ingresso.tipo === TipoIngresso.inteira
                ? { decrement: 1 }
                : undefined,
            qtMeia:
              ingresso.tipo === TipoIngresso.meia
                ? { decrement: 1 }
                : undefined,
          },
        });
      }

      return removido;
    });
  }

  private calcularValor(precoBase: number, tipo: TipoIngresso) {
    return tipo === TipoIngresso.meia
      ? Math.round((precoBase / 2) * 100) / 100
      : precoBase;
  }

  private async ensureAssentoDisponivel(
    sessaoId: number,
    assento?: string,
    ingressoIgnoradoId?: number,
  ) {
    if (!assento) return;

    const existente = await this.prisma.ingresso.findFirst({
      where: {
        sessaoId,
        assento,
        id: ingressoIgnoradoId ? { not: ingressoIgnoradoId } : undefined,
      },
      select: { id: true },
    });

    if (existente) {
      throw new ConflictException('Este assento já está ocupado nesta sessão.');
    }
  }
}
