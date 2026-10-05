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
import { SessoesService } from './sessoes.service';
import { CreateSessaoDto } from './dto/create-sessao.dto';
import { UpdateSessaoDto } from './dto/update-sessao.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Authorize } from '../auth/decorators/authorize.decorator';
import { CargoUsuario } from '../generated/prisma/client';

@ApiTags('sessoes')
@Controller('sessoes')
export class SessoesController {
  constructor(private readonly sessoesService: SessoesService) {}

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
  @Post()
  @ApiOperation({ summary: 'Cadastrar uma nova sessão' })
  @ApiResponse({ status: 201, description: 'Sessão cadastrada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  create(@Body() createSessaoDto: CreateSessaoDto) {
    return this.sessoesService.create(createSessaoDto);
  }

  @Authorize()
  @Get()
  @ApiOperation({ summary: 'Listar todas as sessões' })
  @ApiResponse({
    status: 200,
    description: 'Lista de sessões retornada com sucesso.',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findAll() {
    return this.sessoesService.findAll();
  }

  @Authorize()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma sessão pelo ID' })
  @ApiResponse({ status: 200, description: 'Sessão encontrada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sessoesService.findOne(id);
  }

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de uma sessão' })
  @ApiResponse({ status: 200, description: 'Sessão atualizada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSessaoDto: UpdateSessaoDto,
  ) {
    return this.sessoesService.update(id, updateSessaoDto);
  }

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma sessão' })
  @ApiResponse({ status: 200, description: 'Sessão removida com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sessoesService.remove(id);
  }
}
