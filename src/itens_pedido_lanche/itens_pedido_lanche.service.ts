import { Injectable } from '@nestjs/common';
import { CreateItensPedidoLancheDto } from './dto/create-itens_pedido_lanche.dto';
import { UpdateItensPedidoLancheDto } from './dto/update-itens_pedido_lanche.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ItensPedidoLancheService {
  constructor(private prisma: PrismaService) { }
  create(createItensPedidoLancheDto: CreateItensPedidoLancheDto) {
    return this.prisma.itemPedidoLanche.create({ data: createItensPedidoLancheDto });
  }

  findAll() {
    return this.prisma.itemPedidoLanche.findMany();
  }

  findOne(id: number) {
    return this.prisma.itemPedidoLanche.findUnique({ where: { id } });
  }

  update(id: number, updateItensPedidoLancheDto: UpdateItensPedidoLancheDto) {
    return this.prisma.itemPedidoLanche.update({
      where: { id },
      data: updateItensPedidoLancheDto,
    });
  }

  remove(id: number) {
    return this.prisma.itemPedidoLanche.delete({ where: { id } });
  }
}
