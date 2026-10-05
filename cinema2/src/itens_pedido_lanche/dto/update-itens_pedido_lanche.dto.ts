import { PartialType } from '@nestjs/swagger';
import { CreateItensPedidoLancheDto } from './create-itens_pedido_lanche.dto';

export class UpdateItensPedidoLancheDto extends PartialType(
  CreateItensPedidoLancheDto,
) {}
