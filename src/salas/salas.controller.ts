import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SalasService } from './salas.service';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Authorize } from '../auth/decorators/authorize.decorator';

@ApiTags('salas')
@Controller('salas')
export class SalasController {
  constructor(private readonly salasService: SalasService) {}

  @Authorize()
  @Post()
  @ApiOperation({ summary: 'Cadastrar uma nova sala' })
  @ApiResponse({ status: 201, description: 'Sala cadastrada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  create(@Body() createSalaDto: CreateSalaDto) {
    return this.salasService.create(createSalaDto);
  }

  @Authorize()
  @Get()
  @ApiOperation({ summary: 'Listar todas as salas' })
  @ApiResponse({ status: 200, description: 'Lista de salas retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findAll() {
    return this.salasService.findAll();
  }

  @Authorize()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma sala pelo ID' })
  @ApiResponse({ status: 200, description: 'Sala encontrada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findOne(@Param('id') id: string) {
    return this.salasService.findOne(+id);
  }

  @Authorize()
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de uma sala' })
  @ApiResponse({ status: 200, description: 'Sala atualizada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  update(@Param('id') id: string, @Body() updateSalaDto: UpdateSalaDto) {
    return this.salasService.update(+id, updateSalaDto);
  }

  @Authorize()
  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma sala' })
  @ApiResponse({ status: 200, description: 'Sala removida com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  remove(@Param('id') id: string) {
    return this.salasService.remove(+id);
  }
}
