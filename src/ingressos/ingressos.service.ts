import { Injectable } from '@nestjs/common';
import { CreateIngressoDto } from './dto/create-ingresso.dto';
import { UpdateIngressoDto } from './dto/update-ingresso.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class IngressosService {
  constructor(private prisma: PrismaService) { }
  create(createIngressoDto: CreateIngressoDto) {
    return this.prisma.ingresso.create({ data: createIngressoDto });
  }

  findAll() {
    return this.prisma.ingresso.findMany();
  }

  findOne(id: number) {
    return this.prisma.ingresso.findUnique({ where: { id } });
  }

  update(id: number, updateIngressoDto: UpdateIngressoDto) {
    return this.prisma.ingresso.update({
      where: { id },
      data: updateIngressoDto,
    });
  }

  remove(id: number) {
    return this.prisma.ingresso.delete({ where: { id } });
  }
}
