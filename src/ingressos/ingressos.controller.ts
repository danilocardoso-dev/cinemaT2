import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IngressosService } from './ingressos.service';
import { CreateIngressoDto } from './dto/create-ingresso.dto';
import { UpdateIngressoDto } from './dto/update-ingresso.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Authorize } from '../auth/decorators/authorize.decorator';

@ApiTags('ingressos')
@Controller('ingressos')
export class IngressosController {
  constructor(private readonly ingressosService: IngressosService) {}

  @Authorize()
  @Post()
  @ApiOperation({ summary: 'Emitir um novo ingresso' })
  @ApiResponse({ status: 201, description: 'Ingresso emitido com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  create(@Body() createIngressoDto: CreateIngressoDto) {
    return this.ingressosService.create(createIngressoDto);
  }

  @Authorize()
  @Get()
  @ApiOperation({ summary: 'Listar todos os ingressos' })
  @ApiResponse({ status: 200, description: 'Lista de ingressos retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findAll() {
    return this.ingressosService.findAll();
  }

  @Authorize()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar um ingresso pelo ID' })
  @ApiResponse({ status: 200, description: 'Ingresso encontrado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findOne(@Param('id') id: string) {
    return this.ingressosService.findOne(+id);
  }

  @Authorize()
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um ingresso' })
  @ApiResponse({ status: 200, description: 'Ingresso atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  update(@Param('id') id: string, @Body() updateIngressoDto: UpdateIngressoDto) {
    return this.ingressosService.update(+id, updateIngressoDto);
  }

  @Authorize()
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um ingresso' })
  @ApiResponse({ status: 200, description: 'Ingresso removido com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  remove(@Param('id') id: string) {
    return this.ingressosService.remove(+id);
  }
}
