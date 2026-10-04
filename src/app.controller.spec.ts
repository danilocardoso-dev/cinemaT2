import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';

describe('UsuariosService', () => {
  let service: UsuariosService;
  const create = jest.fn();

  beforeEach(async () => {
    create.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: PrismaService,
          useValue: {
            usuario: { create },
          },
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('retorna 409 quando o e-mail já está cadastrado', async () => {
    create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '7.9.1',
      }),
    );

    await expect(
      service.create({
        nome: 'Usuário Teste',
        email: 'teste@cinema.com',
        senha: '123456',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
