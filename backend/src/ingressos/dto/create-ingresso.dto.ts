import {
  IsEnum,
  IsOptional,
  IsInt,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoIngresso } from '../../generated/prisma';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIngressoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1, description: 'ID da sessão', required: true })
  sessaoId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({
    example: 1,
    description: 'ID do pedido (opcional)',
    required: false,
  })
  pedidoId?: number;

  @IsEnum(TipoIngresso)
  @ApiProperty({
    enum: TipoIngresso,
    example: TipoIngresso.inteira,
    description: 'Tipo de ingresso (inteira ou meia)',
    required: true,
  })
  tipo: TipoIngresso;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  @ApiProperty({
    example: 'A1',
    description: 'Assento do ingresso (opcional)',
    required: false,
  })
  assento?: string;
}
