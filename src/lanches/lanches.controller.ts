import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LanchesService } from './lanches.service';
import { CreateLancheDto } from './dto/create-lanche.dto';
import { UpdateLancheDto } from './dto/update-lanche.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Authorize } from '../auth/decorators/authorize.decorator';

@ApiTags('lanches')
@Controller('lanches')
export class LanchesController {
  constructor(private readonly lanchesService: LanchesService) {}

  @Authorize()
  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo item de lanche' })
  @ApiResponse({ status: 201, description: 'Lanche cadastrado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  create(@Body() createLancheDto: CreateLancheDto) {
    return this.lanchesService.create(createLancheDto);
  }

  @Authorize()
  @Get()
  @ApiOperation({ summary: 'Listar todos os itens da bomboniere' })
  @ApiResponse({ status: 200, description: 'Lista de lanches retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findAll() {
    return this.lanchesService.findAll();
  }

  @Authorize()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar um item de lanche pelo ID' })
  @ApiResponse({ status: 200, description: 'Lanche encontrado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findOne(@Param('id') id: string) {
    return this.lanchesService.findOne(+id);
  }

  @Authorize()
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um lanche' })
  @ApiResponse({ status: 200, description: 'Lanche atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  update(@Param('id') id: string, @Body() updateLancheDto: UpdateLancheDto) {
    return this.lanchesService.update(+id, updateLancheDto);
  }

  @Authorize()
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um item de lanche' })
  @ApiResponse({ status: 200, description: 'Lanche removido com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  remove(@Param('id') id: string) {
    return this.lanchesService.remove(+id);
  }
}
