import { PartialType } from '@nestjs/swagger';
import { CreatePedidoDto } from './create-pedido.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsNumber, IsPositive, IsInt, Min } from 'class-validator';
import { StatusPedido } from '../../generated/prisma';

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {
    @IsOptional()
    @IsInt()
    @Min(0)
    @ApiProperty({ example: 2, description: 'Quantidade de ingressos inteira (opcional)', required: false })
    qtInteira?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    @ApiProperty({ example: 1, description: 'Quantidade de ingressos meia (opcional)', required: false })
    qtMeia?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @ApiProperty({ example: 75.0, description: 'Valor total do pedido (opcional)', required: false })
    valorTotal?: number;

    @IsOptional()
    @IsEnum(StatusPedido)
    @ApiProperty({ enum: StatusPedido, example: StatusPedido.CONCLUIDO, description: 'Status do pedido (opcional)', required: false })
    status?: StatusPedido;

    @IsOptional()
    @IsInt()
    @ApiProperty({ example: 1, description: 'ID do usuário (opcional)', required: false })
    usuarioId?: number;
}
