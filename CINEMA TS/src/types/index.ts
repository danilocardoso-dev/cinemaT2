export type CargoUsuario = 'ADMIN' | 'ATENDENTE' | 'CLIENTE';
export type StatusPedido = 'PENDENTE' | 'CONCLUIDO' | 'CANCELADO';
export type TipoIngresso = 'inteira' | 'meia';

export interface UsuarioAutenticado {
  id: number;
  nome: string;
  email: string;
  cargo: CargoUsuario;
  ativo?: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: 'Bearer';
  user: UsuarioAutenticado;
}

export interface Filme {
  id: number;
  titulo: string;
  sinopse: string;
  classificacao: string;
  duracao: number;
  genero: string;
  datasExibicao: string;
  ativo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Sala {
  id: number;
  numero: number;
  capacidade: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Sessao {
  id: number;
  filmeId: number;
  salaId: number;
  dataHora: string;
  precoBase: number;
  filme?: Filme;
  sala?: Sala;
  createdAt?: string;
  updatedAt?: string;
}

export interface Ingresso {
  id: number;
  sessaoId: number;
  pedidoId?: number | null;
  tipo: TipoIngresso;
  valor: number;
  assento?: string | null;
}

export interface LancheCombo {
  id: number;
  nome: string;
  descricao: string;
  valorUnitario: number;
  qtUnidade: number;
  subtotal: number;
  ativo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ItemPedidoLanche {
  id: number;
  pedidoId: number;
  lancheId: number;
  quantidade: number;
  valorUnitario: number;
  subtotal: number;
  lanche?: LancheCombo;
}

export interface Pedido {
  id: number;
  qtInteira: number;
  qtMeia: number;
  valorTotal: number;
  status: StatusPedido;
  usuarioId?: number | null;
  ingressos?: Ingresso[];
  lanches?: ItemPedidoLanche[];
}

export type SessaoComDetalhes = Sessao;
