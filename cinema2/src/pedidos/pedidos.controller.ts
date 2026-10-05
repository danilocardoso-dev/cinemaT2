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
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Authorize } from '../auth/decorators/authorize.decorator';
import { CargoUsuario } from '../generated/prisma/client';

@ApiTags('pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
  @Post()
  @ApiOperation({ summary: 'Criar um novo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
  @Get()
  @ApiOperation({ summary: 'Listar todos os pedidos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos retornada com sucesso.',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findAll() {
    return this.pedidosService.findAll();
  }

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar um pedido pelo ID' })
  @ApiResponse({ status: 200, description: 'Pedido encontrado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.findOne(id);
  }

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um pedido' })
  @ApiResponse({ status: 200, description: 'Pedido atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ) {
    return this.pedidosService.update(id, updatePedidoDto);
  }

  @Authorize(CargoUsuario.ADMIN, CargoUsuario.ATENDENTE)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um pedido' })
  @ApiResponse({ status: 200, description: 'Pedido removido com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.remove(id);
  }
}
