import { JwtService } from '@nestjs/jwt';
import { CargoUsuario, Prisma, Usuario } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

jest.mock('@nestjs/jwt', () => ({
  JwtService: class JwtService {},
}));

describe('AuthService', () => {
  const findUnique = jest.fn();
  const create = jest.fn<Promise<Usuario>, [Prisma.UsuarioCreateArgs]>();
  const sign = jest.fn().mockReturnValue('token-assinado');
  const prisma = {
    usuario: { findUnique, create },
  } as unknown as PrismaService;
  const jwtService = { sign } as unknown as JwtService;
  const service = new AuthService(prisma, jwtService);

  beforeEach(() => {
    findUnique.mockReset();
    create.mockReset();
    sign.mockClear();
  });

  it('sempre registra publicamente um usuário como CLIENTE ativo', async () => {
    findUnique.mockResolvedValue(null);
    create.mockResolvedValue({
      id: 1,
      nome: 'Cliente Teste',
      email: 'cliente@cinema.com',
      senha: 'hash-da-senha',
      cargo: CargoUsuario.CLIENTE,
      ativo: true,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    await service.register({
      nome: 'Cliente Teste',
      email: 'cliente@cinema.com',
      senha: '123456',
    });

    const createArgs = create.mock.calls[0][0];
    expect(createArgs.data.cargo).toBe(CargoUsuario.CLIENTE);
    expect(createArgs.data.ativo).toBe(true);
  });
});
