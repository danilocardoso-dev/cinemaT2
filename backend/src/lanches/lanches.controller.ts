import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { LanchesService } from './lanches.service';
import { CreateLancheDto } from './dto/create-lanche.dto';
import { UpdateLancheDto } from './dto/update-lanche.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Authorize } from '../auth/decorators/authorize.decorator';
import { CargoUsuario } from '../generated/prisma/client';

@ApiTags('lanches')
@Controller('lanches')
export class LanchesController {
  constructor(private readonly lanchesService: LanchesService) {}

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
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
  @ApiResponse({
    status: 200,
    description: 'Lista de lanches retornada com sucesso.',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findAll() {
    return this.lanchesService.findAll();
  }

  @Authorize()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar um item de lanche pelo ID' })
  @ApiResponse({ status: 200, description: 'Lanche encontrado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lanchesService.findOne(id);
  }

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um lanche' })
  @ApiResponse({ status: 200, description: 'Lanche atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLancheDto: UpdateLancheDto,
  ) {
    return this.lanchesService.update(id, updateLancheDto);
  }

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um item de lanche' })
  @ApiResponse({ status: 200, description: 'Lanche removido com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lanchesService.remove(id);
  }
}
