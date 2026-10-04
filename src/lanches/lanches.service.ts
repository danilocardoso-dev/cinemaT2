import { Injectable } from '@nestjs/common';
import { CreateLancheDto } from './dto/create-lanche.dto';
import { UpdateLancheDto } from './dto/update-lanche.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class LanchesService {
  constructor(private prisma: PrismaService) { }
  create(createLancheDto: CreateLancheDto) {
    return this.prisma.lanche.create({ data: createLancheDto });
  }

  findAll() {
    return this.prisma.lanche.findMany();
  }

  findOne(id: number) {
    return this.prisma.lanche.findUnique({ where: { id } });
  }

  update(id: number, updateLancheDto: UpdateLancheDto) {
    return this.prisma.lanche.update({
      where: { id },
      data: updateLancheDto,
    });
  }

  remove(id: number) {
    return this.prisma.lanche.delete({ where: { id } });
  }
}
