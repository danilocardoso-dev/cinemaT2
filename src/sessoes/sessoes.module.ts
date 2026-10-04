import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SessoesService } from './sessoes.service';
import { SessoesController } from './sessoes.controller';
@Module({
  imports: [PrismaModule], // importado o modulo PrismaModule
  controllers: [SessoesController],
  providers: [SessoesService],
})
export class SessoesModule { }