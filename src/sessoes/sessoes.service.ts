import { Injectable } from '@nestjs/common';
import { CreateSessaoDto } from './dto/create-sessao.dto';
import { UpdateSessaoDto } from './dto/update-sessao.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class SessoesService {
  constructor(private prisma: PrismaService) { }
  create(createSessaoDto: CreateSessaoDto) {
    return this.prisma.sessao.create({ data: createSessaoDto });
  }

  findAll() {
    return this.prisma.sessao.findMany();
  }

  findOne(id: number) {
    return this.prisma.sessao.findUnique({ where: { id } });
  }

  update(id: number, updateSessaoDto: UpdateSessaoDto) {
    return this.prisma.sessao.update({
      where: { id },
      data: updateSessaoDto,
    });
  }

  remove(id: number) {
    return this.prisma.sessao.delete({ where: { id } });
  }
}
