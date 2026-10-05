import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CargoUsuario } from '../generated/prisma/client';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  const getAllAndOverride = jest.fn();
  const reflector = { getAllAndOverride } as unknown as Reflector;
  const guard = new RolesGuard(reflector);

  function context(cargo?: CargoUsuario): ExecutionContext {
    return {
      getHandler: () => function handler() {},
      getClass: () => class Controller {},
      switchToHttp: () => ({
        getRequest: () => (cargo ? { user: { cargo } } : {}),
      }),
    } as unknown as ExecutionContext;
  }

  beforeEach(() => {
    getAllAndOverride.mockReset();
  });

  it('libera uma rota autenticada sem restrição de cargo', () => {
    getAllAndOverride.mockReturnValue(undefined);

    expect(guard.canActivate(context(CargoUsuario.CLIENTE))).toBe(true);
  });

  it('bloqueia um cliente em uma rota exclusiva de administrador', () => {
    getAllAndOverride.mockReturnValue([CargoUsuario.ADMIN]);

    expect(guard.canActivate(context(CargoUsuario.CLIENTE))).toBe(false);
  });

  it('libera um administrador em uma rota exclusiva de administrador', () => {
    getAllAndOverride.mockReturnValue([CargoUsuario.ADMIN]);

    expect(guard.canActivate(context(CargoUsuario.ADMIN))).toBe(true);
  });
});
