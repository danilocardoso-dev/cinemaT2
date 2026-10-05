import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CargoUsuario } from '../generated/prisma/client';
import { getJwtSecret } from './jwt.config';

export interface JwtPayload {
  sub: number;
  email: string;
  cargo: CargoUsuario;
  nome: string;
}

export interface AuthenticatedUser {
  id: number;
  email: string;
  cargo: CargoUsuario;
  nome: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  async validate(payload: JwtPayload) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        ativo: true,
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    if (!usuario.ativo) {
      throw new UnauthorizedException('Usuário desativado no sistema.');
    }

    // O retorno deste método é injetado automaticamente em `req.user`
    const authenticatedUser: AuthenticatedUser = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cargo: usuario.cargo,
    };

    return authenticatedUser;
  }
}
