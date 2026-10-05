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
import { ItensPedidoLancheService } from './itens_pedido_lanche.service';
import { CreateItensPedidoLancheDto } from './dto/create-itens_pedido_lanche.dto';
import { UpdateItensPedidoLancheDto } from './dto/update-itens_pedido_lanche.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Authorize } from '../auth/decorators/authorize.decorator';
import { CargoUsuario } from '../generated/prisma/client';

@ApiTags('itens-pedido-lanche')
@Controller('itens-pedido-lanche')
export class ItensPedidoLancheController {
  constructor(
    private readonly itensPedidoLancheService: ItensPedidoLancheService,
  ) {}

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
  @Post()
  @ApiOperation({ summary: 'Adicionar item de lanche ao pedido' })
  @ApiResponse({ status: 201, description: 'Item adicionado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  create(@Body() createItensPedidoLancheDto: CreateItensPedidoLancheDto) {
    return this.itensPedidoLancheService.create(createItensPedidoLancheDto);
  }

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
  @Get()
  @ApiOperation({ summary: 'Listar todos os itens de pedidos de lanche' })
  @ApiResponse({
    status: 200,
    description: 'Lista de itens retornada com sucesso.',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findAll() {
    return this.itensPedidoLancheService.findAll();
  }

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar item de lanche do pedido pelo ID' })
  @ApiResponse({ status: 200, description: 'Item encontrado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.itensPedidoLancheService.findOne(id);
  }

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar item de lanche do pedido' })
  @ApiResponse({ status: 200, description: 'Item atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItensPedidoLancheDto: UpdateItensPedidoLancheDto,
  ) {
    return this.itensPedidoLancheService.update(id, updateItensPedidoLancheDto);
  }

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover item de lanche do pedido' })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.itensPedidoLancheService.remove(id);
  }
}
