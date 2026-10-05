import axios, { AxiosError } from 'axios';
import type {
  AuthResponse,
  Filme,
  Ingresso,
  ItemPedidoLanche,
  LancheCombo,
  Pedido,
  Sala,
  Sessao,
  UsuarioAutenticado,
} from '@/types';
import { clearAuthSession, getAccessToken } from '@/services/auth-storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && getAccessToken()) {
      clearAuthSession();
      window.dispatchEvent(new Event('cinema:unauthorized'));
    }
    return Promise.reject(error);
  },
);

interface ApiErrorBody {
  message?: string | string[];
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Não foi possível concluir a operação.',
) {
  if (!axios.isAxiosError<ApiErrorBody>(error)) return fallback;
  const message = error.response?.data?.message;
  if (Array.isArray(message)) return message.join(' ');
  if (message) return message;
  if (error.code === 'ECONNABORTED') return 'A API demorou demais para responder.';
  if (!error.response) return 'Não foi possível conectar à API do cinema.';
  return fallback;
}

export const login = (email: string, senha: string) =>
  api.post<AuthResponse>('/auth/login', { email, senha });
export const getProfile = () => api.get<UsuarioAutenticado>('/auth/me');

type FilmePayload = Pick<
  Filme,
  'titulo' | 'sinopse' | 'classificacao' | 'duracao' | 'genero' | 'datasExibicao'
>;
export const getFilmes = () => api.get<Filme[]>('/filmes');
export const createFilme = (filme: FilmePayload) => api.post<Filme>('/filmes', filme);
export const updateFilme = (filme: Filme) => {
  const { id, ativo: _ativo, createdAt: _createdAt, updatedAt: _updatedAt, ...payload } = filme;
  return api.patch<Filme>(`/filmes/${id}`, payload);
};
export const deleteFilme = (id: number) => api.delete(`/filmes/${id}`);
export const getFilme = (id: number) => api.get<Filme>(`/filmes/${id}`);

type SalaPayload = Pick<Sala, 'numero' | 'capacidade'>;
export const getSalas = () => api.get<Sala[]>('/salas');
export const createSala = (sala: SalaPayload) => api.post<Sala>('/salas', sala);
export const updateSala = (sala: Sala) => {
  const { id, createdAt: _createdAt, updatedAt: _updatedAt, ...payload } = sala;
  return api.patch<Sala>(`/salas/${id}`, payload);
};
export const deleteSala = (id: number) => api.delete(`/salas/${id}`);

type SessaoPayload = Pick<Sessao, 'filmeId' | 'salaId' | 'dataHora'> &
  Partial<Pick<Sessao, 'precoBase'>>;
export const getSessoes = () => api.get<Sessao[]>('/sessoes');
export const createSessao = (sessao: SessaoPayload) => api.post<Sessao>('/sessoes', sessao);
export const updateSessao = (sessao: Sessao) => {
  const {
    id,
    filme: _filme,
    sala: _sala,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...payload
  } = sessao;
  return api.patch<Sessao>(`/sessoes/${id}`, payload);
};
export const deleteSessao = (id: number) => api.delete(`/sessoes/${id}`);

export const getIngressos = () => api.get<Ingresso[]>('/ingressos');

type LanchePayload = Pick<
  LancheCombo,
  'nome' | 'descricao' | 'valorUnitario' | 'qtUnidade'
> &
  Partial<Pick<LancheCombo, 'ativo'>>;
export const getLanches = () => api.get<LancheCombo[]>('/lanches');
export const createLanche = (lanche: LanchePayload) => api.post<LancheCombo>('/lanches', lanche);
export const updateLanche = (lanche: LancheCombo) => {
  const {
    id,
    subtotal: _subtotal,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...payload
  } = lanche;
  return api.patch<LancheCombo>(`/lanches/${id}`, payload);
};
export const deleteLanche = (id: number) => api.delete(`/lanches/${id}`);

export interface NovoPedido {
  sessaoId: number;
  qtInteira: number;
  qtMeia: number;
  lanches: Array<{ lancheId: number; quantidade: number }>;
}

export async function createPedidoCompleto(dados: NovoPedido) {
  const pedido = (await api.post<Pedido>('/pedidos', {})).data;

  try {
    for (let index = 0; index < dados.qtInteira; index += 1) {
      await api.post<Ingresso>('/ingressos', {
        pedidoId: pedido.id,
        sessaoId: dados.sessaoId,
        tipo: 'inteira',
      });
    }

    for (let index = 0; index < dados.qtMeia; index += 1) {
      await api.post<Ingresso>('/ingressos', {
        pedidoId: pedido.id,
        sessaoId: dados.sessaoId,
        tipo: 'meia',
      });
    }

    for (const item of dados.lanches) {
      await api.post<ItemPedidoLanche>('/itens-pedido-lanche', {
        pedidoId: pedido.id,
        lancheId: item.lancheId,
        quantidade: item.quantidade,
      });
    }

    return (await api.get<Pedido>(`/pedidos/${pedido.id}`)).data;
  } catch (error) {
    await api.delete(`/pedidos/${pedido.id}`).catch(() => undefined);
    throw error;
  }
}

export default api;
