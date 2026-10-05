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
import { IngressosService } from './ingressos.service';
import { CreateIngressoDto } from './dto/create-ingresso.dto';
import { UpdateIngressoDto } from './dto/update-ingresso.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Authorize } from '../auth/decorators/authorize.decorator';
import { CargoUsuario } from '../generated/prisma/client';

@ApiTags('ingressos')
@Controller('ingressos')
export class IngressosController {
  constructor(private readonly ingressosService: IngressosService) {}

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
  @Post()
  @ApiOperation({ summary: 'Emitir um novo ingresso' })
  @ApiResponse({ status: 201, description: 'Ingresso emitido com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  create(@Body() createIngressoDto: CreateIngressoDto) {
    return this.ingressosService.create(createIngressoDto);
  }

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
  @Get()
  @ApiOperation({ summary: 'Listar todos os ingressos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ingressos retornada com sucesso.',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findAll() {
    return this.ingressosService.findAll();
  }

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar um ingresso pelo ID' })
  @ApiResponse({ status: 200, description: 'Ingresso encontrado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ingressosService.findOne(id);
  }

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um ingresso' })
  @ApiResponse({ status: 200, description: 'Ingresso atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIngressoDto: UpdateIngressoDto,
  ) {
    return this.ingressosService.update(id, updateIngressoDto);
  }

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um ingresso' })
  @ApiResponse({ status: 200, description: 'Ingresso removido com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ingressosService.remove(id);
  }
}
