import { IsNotEmpty, IsString, MaxLength, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class CreateFilmeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @ApiProperty({
    example: 'Homem-Aranha: Sem Volta para Casa',
    description: 'Título do filme',
    required: true,
  })
  titulo: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  @ApiProperty({
    example:
      'Peter Parker descobre que precisa da ajuda do Doutor Estranho para...',
    description: 'Sinopse do filme',
    required: true,
  })
  sinopse: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @ApiProperty({
    example: '16',
    description: 'Classificação indicativa (Livre, 10, 12, 14, 16, 18)',
    required: true,
  })
  classificacao: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({
    example: 142,
    description: 'Duração em minutos',
    required: true,
  })
  duracao: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @ApiProperty({
    example: 'Ação/Aventura',
    description: 'Gênero do filme',
    required: true,
  })
  genero: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '30/07/2026 a 30/08/2026',
    description: 'Período de exibição',
    required: true,
  })
  datasExibicao: string;
}
