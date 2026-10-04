import { PartialType } from '@nestjs/swagger';
import { CreateFilmeDto } from './create-filme.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsInt, Min } from 'class-validator';

export class UpdateFilmeDto extends PartialType(CreateFilmeDto) {
    @IsOptional()
    @IsString()
    @MaxLength(200)
    @ApiProperty({ example: 'Título Atualizado', description: 'Título do filme (opcional)', required: false })
    titulo?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    @ApiProperty({ example: 'Sinopse Atualizada', description: 'Sinopse do filme (opcional)', required: false })
    sinopse?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    @ApiProperty({ example: '18', description: 'Classificação indicativa (opcional)', required: false })
    classificacao?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @ApiProperty({ example: 150, description: 'Duração em minutos (opcional)', required: false })
    duracao?: number;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    @ApiProperty({ example: 'Comédia/Fantasia', description: 'Gênero do filme (opcional)', required: false })
    genero?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: '30/12/2026 a 30/01/2027', description: 'Período de exibição (opcional)', required: false })
    datasExibicao?: string;
}
