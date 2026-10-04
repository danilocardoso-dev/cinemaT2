import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CargoUsuario } from '../../generated/prisma';

export class CreateUsuarioDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @ApiProperty({ example: 'João Silva', description: 'Nome do usuário', required: true })
    nome: string;

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    @ApiProperty({ example: 'joao@email.com', description: 'E-mail do usuário', required: true })
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(50)
    @ApiProperty({ example: 'senha123', description: 'Senha do usuário', required: true })
    senha: string;

    @IsOptional()
    @IsEnum(CargoUsuario)
    @ApiProperty({ enum: CargoUsuario, example: CargoUsuario.ATENDENTE, description: 'Cargo do usuário', required: false, default: CargoUsuario.ATENDENTE })
    cargo?: CargoUsuario;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ example: true, description: 'Indica se o usuário está ativo', required: false, default: true })
    ativo?: boolean;
}
