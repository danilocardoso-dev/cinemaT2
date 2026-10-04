import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsInt, IsPositive, IsString } from 'class-validator';
import { TipoIngresso } from '../../generated/prisma';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIngressoDto {
    @IsNotEmpty()
    @IsInt()
    @ApiProperty({ example: 1, description: 'ID da sessão', required: true })
    sessaoId: number;

    @IsOptional()
    @IsInt()
    @ApiProperty({ example: 1, description: 'ID do pedido (opcional)', required: false })
    pedidoId?: number;

    @IsNotEmpty()
    @IsEnum(TipoIngresso)
    @ApiProperty({ enum: TipoIngresso, example: TipoIngresso.inteira, description: 'Tipo de ingresso (inteira ou meia)', required: true })
    tipo: TipoIngresso;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @ApiProperty({ example: 20.0, description: 'Valor do ingresso', required: true })
    valor: number;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'A1', description: 'Assento do ingresso (opcional)', required: false })
    assento?: string;
}
