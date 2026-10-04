import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return null;
    }

    // Suporta senha com hash bcrypt e também texto plano (compatibilidade retroativa com dados existentes)
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(pass, usuario.senha);
    } catch {
      isPasswordValid = false;
    }

    if (!isPasswordValid && pass === usuario.senha) {
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      return null;
    }

    if (!usuario.ativo) {
      throw new UnauthorizedException('Usuário inativo no sistema.');
    }

    const { senha, ...result } = usuario;
    return result;
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

  async register(createUsuarioDto: CreateUsuarioDto) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { email: createUsuarioDto.email },
    });

    if (usuarioExistente) {
      throw new ConflictException('Já existe um usuário cadastrado com este e-mail.');
    }

    const hashedPassword = bcrypt.hashSync(createUsuarioDto.senha, 10);

    const novoUsuario = await this.prisma.usuario.create({
      data: {
        ...createUsuarioDto,
        senha: hashedPassword,
      },
    });

    const { senha, ...userSemSenha } = novoUsuario;

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
