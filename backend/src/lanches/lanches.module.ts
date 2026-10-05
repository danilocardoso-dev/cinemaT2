import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LanchesService } from './lanches.service';
import { LanchesController } from './lanches.controller';
@Module({
  imports: [PrismaModule], // importado o modulo PrismaModule
  controllers: [LanchesController],
  providers: [LanchesService],
})
export class LanchesModule {}
