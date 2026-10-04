import { UnauthorizedException } from '@nestjs/common';
import { CargoUsuario } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload, JwtStrategy } from './jwt.strategy';

jest.mock('@nestjs/passport', () => ({
  PassportStrategy: () => class PassportStrategy {},
}));

describe('JwtStrategy', () => {
  const findUnique = jest.fn();
  const prisma = {
    usuario: { findUnique },
  } as unknown as PrismaService;

  const payload: JwtPayload = {
    sub: 1,
    nome: 'Nome antigo do token',
    email: 'antigo@cinema.com',
    cargo: CargoUsuario.CLIENTE,
  };

  beforeAll(() => {
    process.env.JWT_SECRET = 'chave-de-teste-com-mais-de-32-caracteres';
  });

  beforeEach(() => {
    findUnique.mockReset();
  });

  it('retorna o perfil atual armazenado no banco', async () => {
    findUnique.mockResolvedValue({
      id: 1,
      nome: 'Nome atual',
      email: 'atual@cinema.com',
      cargo: CargoUsuario.ATENDENTE,
      ativo: true,
    });
    const strategy = new JwtStrategy(prisma);

    await expect(strategy.validate(payload)).resolves.toEqual({
      id: 1,
      nome: 'Nome atual',
      email: 'atual@cinema.com',
      cargo: CargoUsuario.ATENDENTE,
    });
  });

  it('rejeita um usuário que foi desativado depois da emissão do token', async () => {
    findUnique.mockResolvedValue({
      id: 1,
      nome: 'Usuário inativo',
      email: 'inativo@cinema.com',
      cargo: CargoUsuario.CLIENTE,
      ativo: false,
    });
    const strategy = new JwtStrategy(prisma);

    await expect(strategy.validate(payload)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
