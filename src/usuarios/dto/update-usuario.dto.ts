import { PartialType } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsEmail, IsEnum, IsBoolean } from 'class-validator';
import { CargoUsuario } from '../../generated/prisma';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    @IsOptional()
    @IsString()
    @MaxLength(50)
    @ApiProperty({ example: 'Novo Nome', description: 'Nome do usuário (opcional)', required: false })
    nome?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    @ApiProperty({ example: 'NovaSenha123', description: 'Senha do usuário (opcional)', required: false })
    senha?: string;

    @IsOptional()
    @IsEmail()
    @MaxLength(100)
    @ApiProperty({ example: 'novousuario@email.com', description: 'Email do usuário (opcional)', required: false })
    email?: string;

    @IsOptional()
    @IsEnum(CargoUsuario)
    @ApiProperty({ enum: CargoUsuario, example: CargoUsuario.ATENDENTE, description: 'Cargo do usuário (opcional)', required: false })
    cargo?: CargoUsuario;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ example: true, description: 'Indica se o usuário está ativo (opcional)', required: false })
    ativo?: boolean;
}
