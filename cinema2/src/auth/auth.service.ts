import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { CargoUsuario, Prisma, Usuario } from '../generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private semSenha(usuario: Usuario) {
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cargo: usuario.cargo,
      ativo: usuario.ativo,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt,
    };
  }

  async validateUser(email: string, pass: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!usuario) {
      return null;
    }

    const isPasswordValid = await bcrypt
      .compare(pass, usuario.senha)
      .catch(() => false);

    if (!isPasswordValid) {
      return null;
    }

    if (!usuario.ativo) {
      throw new UnauthorizedException('Usuário inativo no sistema.');
    }

    return this.semSenha(usuario);
  }

  async login(loginDto: LoginDto) {
    const usuario = await this.validateUser(loginDto.email, loginDto.senha);

    if (!usuario) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      cargo: usuario.cargo,
      nome: usuario.nome,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      user: usuario,
    };
  }

  async register(registerDto: RegisterDto) {
    const email = registerDto.email.trim().toLowerCase();
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      throw new ConflictException(
        'Já existe um usuário cadastrado com este e-mail.',
      );
    }

    const hashedPassword = await bcrypt.hash(registerDto.senha, 10);
    let novoUsuario: Usuario;

    try {
      novoUsuario = await this.prisma.usuario.create({
        data: {
          nome: registerDto.nome,
          email,
          senha: hashedPassword,
          cargo: CargoUsuario.CLIENTE,
          ativo: true,
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe um usuário cadastrado com este e-mail.',
        );
      }

      throw error;
    }

    const userSemSenha = this.semSenha(novoUsuario);

    const payload = {
      sub: userSemSenha.id,
      email: userSemSenha.email,
      cargo: userSemSenha.cargo,
      nome: userSemSenha.nome,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      user: userSemSenha,
    };
  }
}
