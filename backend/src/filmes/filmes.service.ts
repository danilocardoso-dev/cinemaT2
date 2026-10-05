import { Injectable } from '@nestjs/common';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { UpdateFilmeDto } from './dto/update-filme.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class FilmesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createFilmeDto: CreateFilmeDto) {
    return this.prisma.filme.create({ data: createFilmeDto });
  }

  findAll() {
    return this.prisma.filme.findMany({ orderBy: { titulo: 'asc' } });
  }

  findOne(id: number) {
    return this.prisma.filme.findUniqueOrThrow({ where: { id } });
  }

  update(id: number, updateFilmeDto: UpdateFilmeDto) {
    return this.prisma.filme.update({
      where: { id },
      data: updateFilmeDto,
    });
  }

  remove(id: number) {
    return this.prisma.filme.delete({ where: { id } });
  }
}
