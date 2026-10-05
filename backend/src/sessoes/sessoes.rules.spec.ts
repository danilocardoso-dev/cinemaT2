import { ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SessoesService } from './sessoes.service';

describe('SessoesService rules', () => {
  it('bloqueia duas sessões na mesma sala e horário', async () => {
    const createSession = jest.fn();
    const prisma = {
      sessao: {
        findFirst: jest.fn().mockResolvedValue({ id: 99 }),
        create: createSession,
      },
    } as unknown as PrismaService;
    const service = new SessoesService(prisma);

    await expect(
      service.create({
        filmeId: 1,
        salaId: 1,
        dataHora: '2027-01-10T20:00:00.000Z',
        precoBase: 40,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(createSession).not.toHaveBeenCalled();
  });
});
