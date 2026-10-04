import { PartialType } from '@nestjs/swagger';
import { CreateLancheDto } from './create-lanche.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsNumber, IsPositive, IsInt, Min } from 'class-validator';

export class UpdateLancheDto extends PartialType(CreateLancheDto) {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    @ApiProperty({ example: 'Pipoca Grande', description: 'Nome do lanche (opcional)', required: false })
    nome?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    @ApiProperty({ example: 'Pipoca grande com manteiga', description: 'Descrição do lanche (opcional)', required: false })
    descricao?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @ApiProperty({ example: 22.50, description: 'Valor unitário do lanche (opcional)', required: false })
    valorUnitario?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    @ApiProperty({ example: 10, description: 'Quantidade em estoque (opcional)', required: false })
    qtUnidade?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @ApiProperty({ example: 225.0, description: 'Subtotal (opcional)', required: false })
    subtotal?: number;
}
