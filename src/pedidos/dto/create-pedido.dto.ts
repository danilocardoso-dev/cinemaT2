import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, Min, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { StatusPedido } from '../../generated/prisma';

export class CreatePedidoDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    @ApiProperty({ example: 2, description: 'Quantidade de ingressos inteira', required: false, default: 0 })
    qtInteira?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    @ApiProperty({ example: 1, description: 'Quantidade de ingressos meia', required: false, default: 0 })
    qtMeia?: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @ApiProperty({ example: 37.50, description: 'Valor total do pedido', required: true })
    valorTotal: number;

    @IsOptional()
    @IsEnum(StatusPedido)
    @ApiProperty({ enum: StatusPedido, example: StatusPedido.CONCLUIDO, description: 'Status do pedido', required: false })
    status?: StatusPedido;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @ApiProperty({ example: 1, description: 'ID do usuário', required: false })
    usuarioId?: number;
}
