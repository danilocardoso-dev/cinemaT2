import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FilmesService } from './filmes.service';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { UpdateFilmeDto } from './dto/update-filme.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Authorize } from '../auth/decorators/authorize.decorator';

@ApiTags('filmes')
@Controller('filmes')
export class FilmesController {
  constructor(private readonly filmesService: FilmesService) {}

  @Authorize()
  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo filme' })
  @ApiResponse({ status: 201, description: 'Filme cadastrado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  create(@Body() createFilmeDto: CreateFilmeDto) {
    return this.filmesService.create(createFilmeDto);
  }

  @Authorize()
  @Get()
  @ApiOperation({ summary: 'Listar todos os filmes' })
  @ApiResponse({ status: 200, description: 'Lista de filmes retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findAll() {
    return this.filmesService.findAll();
  }

  @Authorize()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar um filme pelo ID' })
  @ApiResponse({ status: 200, description: 'Filme encontrado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findOne(@Param('id') id: string) {
    return this.filmesService.findOne(+id);
  }

  @Authorize()
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um filme' })
  @ApiResponse({ status: 200, description: 'Filme atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  update(@Param('id') id: string, @Body() updateFilmeDto: UpdateFilmeDto) {
    return this.filmesService.update(+id, updateFilmeDto);
  }

  @Authorize()
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um filme' })
  @ApiResponse({ status: 200, description: 'Filme removido com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  remove(@Param('id') id: string) {
    return this.filmesService.remove(+id);
  }
}
