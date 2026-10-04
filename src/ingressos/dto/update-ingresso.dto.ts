import { PartialType } from '@nestjs/swagger';
import { CreateIngressoDto } from './create-ingresso.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsEnum, IsNumber, IsPositive, IsString } from 'class-validator';
import { TipoIngresso } from '../../generated/prisma';

export class UpdateIngressoDto extends PartialType(CreateIngressoDto) {
    @IsOptional()
    @IsInt()
    @ApiProperty({ example: 1, description: 'ID da sessão (opcional)', required: false })
    sessaoId?: number;

    @IsOptional()
    @IsInt()
    @ApiProperty({ example: 1, description: 'ID do pedido (opcional)', required: false })
    pedidoId?: number;

    @IsOptional()
    @IsEnum(TipoIngresso)
    @ApiProperty({ enum: TipoIngresso, example: TipoIngresso.meia, description: 'Tipo de ingresso (opcional)', required: false })
    tipo?: TipoIngresso;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @ApiProperty({ example: 25.0, description: 'Valor do ingresso (opcional)', required: false })
    valor?: number;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'B2', description: 'Assento do ingresso (opcional)', required: false })
    assento?: string;
}
