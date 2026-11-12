import axios from 'axios';
import { API_URL } from '../config';
import { getAccessToken } from './storage';
import type {
  AuthResponse, Filme, Ingresso, ItemPedidoLanche, Lanche, Pedido, Sala, Sessao, UsuarioAutenticado,
} from '../types';

const api = axios.create({ baseURL: API_URL, timeout: 10000 });

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Quem registra o handler (AuthContext) é avisado quando o token expira
let aoExpirar: (() => void) | null = null;
export function onUnauthorized(handler: () => void) {
  aoExpirar = handler;
}

api.interceptors.response.use(
  (resposta) => resposta,
  (erro: unknown) => {
    if (axios.isAxiosError(erro) && erro.response?.status === 401 && getAccessToken() && aoExpirar) aoExpirar();
    return Promise.reject(erro);
  },
);

interface CorpoDeErro {
  message?: string | string[];
}

export function mensagemDeErro(erro: unknown, padrao = 'Não foi possível concluir a operação.'): string {
  if (!axios.isAxiosError<CorpoDeErro>(erro)) return padrao;
  const msg = erro.response?.data?.message;
  if (Array.isArray(msg)) return msg.join(' ');
  if (msg) return msg;
  if (erro.code === 'ECONNABORTED') return 'A API demorou demais para responder.';
  if (!erro.response) return `Não foi possível conectar à API (${API_URL}).`;
  return padrao;
}

// ---- Autenticação
export const login = (email: string, senha: string) => api.post<AuthResponse>('/auth/login', { email, senha });
export const registrar = (nome: string, email: string, senha: string) =>
  api.post<AuthResponse>('/auth/register', { nome, email, senha });
export const getPerfil = () => api.get<UsuarioAutenticado>('/auth/me');

// ---- Filmes
export type DadosFilme = Omit<Filme, 'id' | 'ativo'> & { id?: number };
export const getFilmes = () => api.get<Filme[]>('/filmes');
export const salvarFilme = ({ id, ...dados }: DadosFilme) =>
  id ? api.patch<Filme>(`/filmes/${id}`, dados) : api.post<Filme>('/filmes', dados);
export const excluirFilme = (id: number) => api.delete(`/filmes/${id}`);

// ---- Salas
export type DadosSala = Omit<Sala, 'id'> & { id?: number };
export const getSalas = () => api.get<Sala[]>('/salas');
export const salvarSala = ({ id, ...dados }: DadosSala) =>
  id ? api.patch<Sala>(`/salas/${id}`, dados) : api.post<Sala>('/salas', dados);
export const excluirSala = (id: number) => api.delete(`/salas/${id}`);

// ---- Sessões
export interface DadosSessao {
  id?: number;
  filmeId: number;
  salaId: number;
  dataHora: string;
}
export const getSessoes = () => api.get<Sessao[]>('/sessoes');
export const salvarSessao = ({ id, ...dados }: DadosSessao) =>
  id ? api.patch<Sessao>(`/sessoes/${id}`, dados) : api.post<Sessao>('/sessoes', dados);
export const excluirSessao = (id: number) => api.delete(`/sessoes/${id}`);

// ---- Lanches
export interface DadosLanche {
  id?: number;
  nome: string;
  descricao: string;
  valorUnitario: number;
  qtUnidade: number;
}
export const getLanches = () => api.get<Lanche[]>('/lanches');
export const salvarLanche = ({ id, ...dados }: DadosLanche) =>
  id ? api.patch<Lanche>(`/lanches/${id}`, dados) : api.post<Lanche>('/lanches', dados);
export const excluirLanche = (id: number) => api.delete(`/lanches/${id}`);

// ---- Pedido completo (pedido + ingressos + lanches), igual ao painel web
export interface NovoPedido {
  sessaoId: number;
  qtInteira: number;
  qtMeia: number;
  lanches: Array<{ lancheId: number; quantidade: number }>;
}

export async function criarPedidoCompleto({ sessaoId, qtInteira, qtMeia, lanches }: NovoPedido): Promise<Pedido> {
  const pedido = (await api.post<Pedido>('/pedidos', {})).data;
  try {
    for (let i = 0; i < qtInteira; i += 1) {
      await api.post<Ingresso>('/ingressos', { pedidoId: pedido.id, sessaoId, tipo: 'inteira' });
    }
    for (let i = 0; i < qtMeia; i += 1) {
      await api.post<Ingresso>('/ingressos', { pedidoId: pedido.id, sessaoId, tipo: 'meia' });
    }
    for (const item of lanches) {
      await api.post<ItemPedidoLanche>('/itens-pedido-lanche', {
        pedidoId: pedido.id,
        lancheId: item.lancheId,
        quantidade: item.quantidade,
      });
    }
    return (await api.get<Pedido>(`/pedidos/${pedido.id}`)).data;
  } catch (erro) {
    // desfaz o pedido incompleto
    await api.delete(`/pedidos/${pedido.id}`).catch(() => undefined);
    throw erro;
  }
}

export default api;
