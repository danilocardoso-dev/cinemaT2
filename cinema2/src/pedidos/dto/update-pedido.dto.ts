import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { StatusPedido } from '../../generated/prisma/client';

export class UpdatePedidoDto {
  @IsOptional()
  @IsEnum(StatusPedido)
  @ApiProperty({ enum: StatusPedido, required: false })
  status?: StatusPedido;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1, description: 'ID do usuário', required: false })
  usuarioId?: number;
}
