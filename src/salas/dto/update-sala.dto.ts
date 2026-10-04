import { PartialType } from '@nestjs/swagger';
import { CreateSalaDto } from './create-sala.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsPositive } from 'class-validator';

export class UpdateSalaDto extends PartialType(CreateSalaDto) {
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @ApiProperty({ example: 1, description: 'Número da sala (opcional)', required: false })
    numero?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @ApiProperty({ example: 100, description: 'Capacidade da sala (opcional)', required: false })
    capacidade?: number;
}
