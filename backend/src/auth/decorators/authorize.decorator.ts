import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CargoUsuario } from '../../generated/prisma/client';
import { Roles } from './roles.decorator';

/**
 * Documenta a autenticação JWT e, opcionalmente, restringe a rota por cargo.
 * A autenticação é aplicada globalmente pelo JwtAuthGuard.
 */
export function Authorize(...roles: CargoUsuario[]) {
  return applyDecorators(
    Roles(...roles),
    ApiBearerAuth('JWT-auth'),
    ApiUnauthorizedResponse({
      description:
        'Acesso não autorizado. Forneça um token JWT válido no cabeçalho Authorization: Bearer <token>',
    }),
    ApiForbiddenResponse({
      description: 'O usuário autenticado não possui permissão para esta ação.',
    }),
  );
}
