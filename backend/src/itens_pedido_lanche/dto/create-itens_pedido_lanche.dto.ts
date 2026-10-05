import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class CreateItensPedidoLancheDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1, description: 'ID do pedido', required: true })
  pedidoId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1, description: 'ID do lanche', required: true })
  lancheId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({
    example: 3,
    description: 'Quantidade do lanche',
    required: true,
  })
  quantidade: number;
}
