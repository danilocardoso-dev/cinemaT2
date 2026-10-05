import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSessaoDto } from './dto/create-sessao.dto';
import { UpdateSessaoDto } from './dto/update-sessao.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class SessoesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSessaoDto: CreateSessaoDto) {
    await this.ensureHorarioDisponivel(
      createSessaoDto.salaId,
      new Date(createSessaoDto.dataHora),
    );
    return this.prisma.sessao.create({ data: createSessaoDto });
  }

  findAll() {
    return this.prisma.sessao.findMany({
      include: { filme: true, sala: true },
      orderBy: { dataHora: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.sessao.findUniqueOrThrow({
      where: { id },
      include: { filme: true, sala: true },
    });
  }

  async update(id: number, updateSessaoDto: UpdateSessaoDto) {
    const atual = await this.prisma.sessao.findUniqueOrThrow({ where: { id } });
    await this.ensureHorarioDisponivel(
      updateSessaoDto.salaId ?? atual.salaId,
      new Date(updateSessaoDto.dataHora ?? atual.dataHora),
      id,
    );

    return this.prisma.sessao.update({
      where: { id },
      data: updateSessaoDto,
    });
  }

  remove(id: number) {
    return this.prisma.sessao.delete({ where: { id } });
  }

  private async ensureHorarioDisponivel(
    salaId: number,
    dataHora: Date,
    sessaoIgnoradaId?: number,
  ) {
    const conflito = await this.prisma.sessao.findFirst({
      where: {
        salaId,
        dataHora,
        id: sessaoIgnoradaId ? { not: sessaoIgnoradaId } : undefined,
      },
      select: { id: true },
    });

    if (conflito) {
      throw new ConflictException(
        'Já existe uma sessão nesta sala para a mesma data e horário.',
      );
    }
  }
}
