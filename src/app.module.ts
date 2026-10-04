import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { FilmesService } from './filmes/filmes.service';
import { IngressosService } from './ingressos/ingressos.service';
import { ItensPedidoLancheService } from './itens_pedido_lanche/itens_pedido_lanche.service';
import { LanchesService } from './lanches/lanches.service';
import { PedidosService } from './pedidos/pedidos.service';
import { SalasService } from './salas/salas.service';
import { SessoesService } from './sessoes/sessoes.service';
import { UsuariosService } from './usuarios/usuarios.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { FilmesModule } from './filmes/filmes.module';
import { IngressosModule } from './ingressos/ingressos.module';
import { ItensPedidoLancheModule } from './itens_pedido_lanche/itens_pedido_lanche.module';
import { LanchesModule } from './lanches/lanches.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { SalasModule } from './salas/salas.module';
import { SessoesModule } from './sessoes/sessoes.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsuariosModule,
    FilmesModule,
    IngressosModule,
    ItensPedidoLancheModule,
    LanchesModule,
    PedidosModule,
    SalasModule,
    SessoesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    FilmesService,
    IngressosService,
    ItensPedidoLancheService,
    LanchesService,
    PedidosService,
    SalasService,
    SessoesService,
    UsuariosService,
  ],
})
export class AppModule {}
