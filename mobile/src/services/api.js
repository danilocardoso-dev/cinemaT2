import axios from 'axios';
import { API_URL } from '../config';
import { getAccessToken } from './storage';

const api = axios.create({ baseURL: API_URL, timeout: 10000 });

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Quem registra o handler (AuthContext) é avisado quando o token expira
let aoExpirar = null;
export function onUnauthorized(handler) {
  aoExpirar = handler;
}

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (erro.response?.status === 401 && getAccessToken() && aoExpirar) aoExpirar();
    return Promise.reject(erro);
  },
);

export function mensagemDeErro(erro, padrao = 'Não foi possível concluir a operação.') {
  if (!axios.isAxiosError(erro)) return padrao;
  const msg = erro.response?.data?.message;
  if (Array.isArray(msg)) return msg.join(' ');
  if (msg) return msg;
  if (erro.code === 'ECONNABORTED') return 'A API demorou demais para responder.';
  if (!erro.response) return `Não foi possível conectar à API (${API_URL}).`;
  return padrao;
}

// ---- Autenticação
export const login = (email, senha) => api.post('/auth/login', { email, senha });
export const registrar = (nome, email, senha) => api.post('/auth/register', { nome, email, senha });
export const getPerfil = () => api.get('/auth/me');

// ---- Filmes
export const getFilmes = () => api.get('/filmes');
export const salvarFilme = (f) => {
  const { id, ...dados } = f;
  return id ? api.patch(`/filmes/${id}`, dados) : api.post('/filmes', dados);
};
export const excluirFilme = (id) => api.delete(`/filmes/${id}`);

// ---- Salas
export const getSalas = () => api.get('/salas');
export const salvarSala = (s) => {
  const { id, ...dados } = s;
  return id ? api.patch(`/salas/${id}`, dados) : api.post('/salas', dados);
};
export const excluirSala = (id) => api.delete(`/salas/${id}`);

// ---- Sessões
export const getSessoes = () => api.get('/sessoes');
export const salvarSessao = (s) => {
  const { id, ...dados } = s;
  return id ? api.patch(`/sessoes/${id}`, dados) : api.post('/sessoes', dados);
};
export const excluirSessao = (id) => api.delete(`/sessoes/${id}`);

// ---- Lanches
export const getLanches = () => api.get('/lanches');
export const salvarLanche = (l) => {
  const { id, ...dados } = l;
  return id ? api.patch(`/lanches/${id}`, dados) : api.post('/lanches', dados);
};
export const excluirLanche = (id) => api.delete(`/lanches/${id}`);

// ---- Pedido completo (pedido + ingressos + lanches), igual ao painel web
export async function criarPedidoCompleto({ sessaoId, qtInteira, qtMeia, lanches }) {
  const pedido = (await api.post('/pedidos', {})).data;
  try {
    for (let i = 0; i < qtInteira; i += 1) {
      await api.post('/ingressos', { pedidoId: pedido.id, sessaoId, tipo: 'inteira' });
    }
    for (let i = 0; i < qtMeia; i += 1) {
      await api.post('/ingressos', { pedidoId: pedido.id, sessaoId, tipo: 'meia' });
    }
    for (const item of lanches) {
      await api.post('/itens-pedido-lanche', {
        pedidoId: pedido.id,
        lancheId: item.lancheId,
        quantidade: item.quantidade,
      });
    }
    return (await api.get(`/pedidos/${pedido.id}`)).data;
  } catch (erro) {
    // desfaz o pedido incompleto
    await api.delete(`/pedidos/${pedido.id}`).catch(() => undefined);
    throw erro;
  }
}

export default api;
