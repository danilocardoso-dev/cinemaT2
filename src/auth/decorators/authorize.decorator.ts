import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../jwt-auth.guard';

/**
 * Decorator `@Authorize` / `@Authorize()` para proteger rotas com autenticação JWT
 * e registrar a exigência de Bearer Token no Swagger (adicionando a tag e o cadeado de autorização).
 */
export function Authorize(...args: any[]) {
  const decorator = applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Acesso não autorizado. Forneça um token JWT válido no cabeçalho Authorization: Bearer <token>',
    }),
  );

  // Suporte a chamada sem parênteses: @Authorize
  if (
    args.length >= 1 &&
    (typeof args[0] === 'function' || typeof args[0] === 'object')
  ) {
    return (decorator as any)(...args);
  }

  // Suporte a chamada com parênteses: @Authorize()
  return decorator;
}
