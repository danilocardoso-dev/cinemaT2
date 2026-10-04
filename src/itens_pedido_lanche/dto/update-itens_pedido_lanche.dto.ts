import { PartialType } from '@nestjs/swagger';
import { CreateItensPedidoLancheDto } from './create-itens_pedido_lanche.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsNumber, IsPositive } from 'class-validator';

export class UpdateItensPedidoLancheDto extends PartialType(CreateItensPedidoLancheDto) {
    @IsOptional()
    @IsInt()
    @Min(1)
    @ApiProperty({ example: 1, description: 'ID do pedido (opcional)', required: false })
    pedidoId?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @ApiProperty({ example: 2, description: 'ID do lanche (opcional)', required: false })
    lancheId?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @ApiProperty({ example: 2, description: 'Quantidade do lanche (opcional)', required: false })
    quantidade?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @ApiProperty({ example: 20.0, description: 'Valor unitário do lanche (opcional)', required: false })
    valorUnitario?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @ApiProperty({ example: 40.0, description: 'Subtotal do item (opcional)', required: false })
    subtotal?: number;
}
