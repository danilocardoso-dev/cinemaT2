import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcryptjs';
import { Prisma, Usuario } from '../generated/prisma/client';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

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

  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      const data = {
        ...createUsuarioDto,
        email: createUsuarioDto.email.trim().toLowerCase(),
        senha: await bcrypt.hash(createUsuarioDto.senha, 10),
      };

      const usuario = await this.prisma.usuario.create({ data });
      return this.semSenha(usuario);
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
  }

  async findAll() {
    const usuarios = await this.prisma.usuario.findMany({
      orderBy: { nome: 'asc' },
    });
    return usuarios.map((usuario) => this.semSenha(usuario));
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUniqueOrThrow({
      where: { id },
    });
    return this.semSenha(usuario);
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const data = {
      ...updateUsuarioDto,
      email: updateUsuarioDto.email?.trim().toLowerCase(),
    };
    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10);
    }

    try {
      const usuario = await this.prisma.usuario.update({
        where: { id },
        data,
      });
      return this.semSenha(usuario);
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
  }

  async remove(id: number) {
    const usuario = await this.prisma.usuario.delete({ where: { id } });
    return this.semSenha(usuario);
  }
}
