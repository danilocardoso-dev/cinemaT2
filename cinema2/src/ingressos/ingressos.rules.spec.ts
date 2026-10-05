import { ConflictException } from '@nestjs/common';
import { TipoIngresso } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IngressosService } from './ingressos.service';

describe('IngressosService rules', () => {
  const sessaoFindUniqueOrThrow = jest.fn();
  const ingressoFindFirst = jest.fn();
  const ingressoCreate = jest.fn();
  const prisma = {
    sessao: { findUniqueOrThrow: sessaoFindUniqueOrThrow },
    ingresso: {
      findFirst: ingressoFindFirst,
      create: ingressoCreate,
    },
  } as unknown as PrismaService;
  const service = new IngressosService(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calcula meia-entrada a partir do preço da sessão', async () => {
    sessaoFindUniqueOrThrow.mockResolvedValue({
      id: 1,
      precoBase: 40,
      sala: { capacidade: 100 },
      _count: { ingressos: 10 },
    });
    ingressoFindFirst.mockResolvedValue(null);
    ingressoCreate.mockImplementation(({ data }) => Promise.resolve(data));

    const ingresso = await service.create({
      sessaoId: 1,
      tipo: TipoIngresso.meia,
      assento: 'A1',
    });

    expect(ingresso).toEqual(expect.objectContaining({ valor: 20 }));
  });

  it('bloqueia emissão quando a sala está lotada', async () => {
    sessaoFindUniqueOrThrow.mockResolvedValue({
      id: 1,
      precoBase: 40,
      sala: { capacidade: 1 },
      _count: { ingressos: 1 },
    });

    await expect(
      service.create({ sessaoId: 1, tipo: TipoIngresso.inteira }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(ingressoCreate).not.toHaveBeenCalled();
  });
});
