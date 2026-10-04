import { IsNotEmpty, IsNumber, Min, IsString, MaxLength, IsInt, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLancheDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    @ApiProperty({ example: 'Pipoca Grande', description: 'Nome do lanche', required: true })
    nome: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(500)
    @ApiProperty({ example: 'Pipoca salgada tamanho grande com manteiga', description: 'Descrição do lanche', required: true })
    descricao: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @ApiProperty({ example: 15.00, description: 'Valor unitário do lanche', required: true })
    valorUnitario: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    @ApiProperty({ example: 50, description: 'Quantidade em estoque', required: false, default: 0 })
    qtUnidade?: number;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ example: true, description: 'Indica se o lanche está ativo no cardápio', required: false, default: true })
    ativo?: boolean;
}
