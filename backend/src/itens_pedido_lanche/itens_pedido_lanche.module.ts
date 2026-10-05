import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ItensPedidoLancheService } from './itens_pedido_lanche.service';
import { ItensPedidoLancheController } from './itens_pedido_lanche.controller';
@Module({
  imports: [PrismaModule], // importado o modulo PrismaModule
  controllers: [ItensPedidoLancheController],
  providers: [ItensPedidoLancheService],
})
export class ItensPedidoLancheModule {}
