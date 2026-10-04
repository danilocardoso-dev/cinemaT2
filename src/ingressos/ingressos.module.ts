import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { IngressosService } from './ingressos.service';
import { IngressosController } from './ingressos.controller';
@Module({
  imports: [PrismaModule], // importado o modulo PrismaModule
  controllers: [IngressosController],
  providers: [IngressosService],
})
export class IngressosModule { }