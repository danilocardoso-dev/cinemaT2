import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateSalaDto {
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @ApiProperty({ example: 1, description: 'Número da sala', required: true })
    numero: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @ApiProperty({ example: 200, description: 'Capacidade máxima de espectadores', required: true })
    capacidade: number;
}
