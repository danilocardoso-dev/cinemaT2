import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SalasService } from './salas.service';
import { SalasController } from './salas.controller';
@Module({
  imports: [PrismaModule], // importado o modulo PrismaModule
  controllers: [SalasController],
  providers: [SalasService],
})
export class SalasModule { }