import { PartialType } from '@nestjs/swagger';
import { CreateSessaoDto } from './create-sessao.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsDateString, IsNumber, Min } from 'class-validator';

export class UpdateSessaoDto extends PartialType(CreateSessaoDto) {
    @IsOptional()
    @IsInt()
    @ApiProperty({ example: 1, description: 'ID do filme (opcional)', required: false })
    filmeId?: number;

    @IsOptional()
    @IsInt()
    @ApiProperty({ example: 1, description: 'ID da sala (opcional)', required: false })
    salaId?: number;

    @IsOptional()
    @IsDateString()
    @ApiProperty({ example: '2026-12-31T22:00:00Z', description: 'Data e hora da sessão no formato ISO 8601 (opcional)', required: false })
    dataHora?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @ApiProperty({ example: 40.0, description: 'Preço base da sessão (opcional)', required: false })
    precoBase?: number;
}
