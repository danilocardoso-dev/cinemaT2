import {
  IsNotEmpty,
  IsInt,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateSessaoDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1, description: 'ID do filme', required: true })
  filmeId: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1, description: 'ID da sala', required: true })
  salaId: number;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    example: '2026-12-31T22:00:00Z',
    description: 'Data e hora da sessão no formato ISO 8601',
    required: true,
  })
  dataHora: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  @ApiProperty({
    example: 40.0,
    description: 'Preço base da sessão',
    required: false,
    default: 40.0,
  })
  precoBase?: number;
}
