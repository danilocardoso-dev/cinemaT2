import { IsInt, IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateItensPedidoLancheDto {
    @IsInt()
    @Min(1)
    @ApiProperty({ example: 1, description: 'ID do pedido', required: true })
    pedidoId: number;

    @IsInt()
    @Min(1)
    @ApiProperty({ example: 1, description: 'ID do lanche', required: true })
    lancheId: number;

    @IsInt()
    @Min(1)
    @ApiProperty({ example: 3, description: 'Quantidade do lanche', required: true })
    quantidade: number;

    @IsPositive()
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 15.00, description: 'Valor unitário do lanche', required: true })
    valorUnitario: number;

    @IsPositive()
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 45.00, description: 'Subtotal do item (quantidade * valorUnitario)', required: true })
    subtotal: number;
}
