import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
@Module({
  imports: [PrismaModule], // importado o modulo PrismaModule
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
