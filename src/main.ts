import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Configuração do ValidationPipe para validação de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Configuração do Swagger com suporte a Bearer Token (Authorize)
  const config = new DocumentBuilder()
    .setTitle('Cinema API')
    .setDescription('Documentação da API de Cinema com NestJS, Prisma e Autenticação JWT')
    .setVersion('1.0')
    .addTag('auth', 'Autenticação e geração de token JWT')
    .addTag('usuarios', 'Gestão de Usuários')
    .addTag('filmes', 'Catálogo de Filmes')
    .addTag('salas', 'Salas de Cinema')
    .addTag('sessoes', 'Sessões de Filmes')
    .addTag('ingressos', 'Ingressos Emitidos')
    .addTag('lanches', 'Bomboniere / Lanches')
    .addTag('pedidos', 'Pedidos de Ingressos e Lanches')
    .addTag('itens-pedido-lanche', 'Itens do Pedido de Lanches')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Insira o token JWT gerado em /auth/login no formato: Bearer <seu_token>',
        in: 'header',
      },
      'JWT-auth',
    )
    .addBearerAuth() // Registra também com identificador padrão 'bearer' compatível com @ApiBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
