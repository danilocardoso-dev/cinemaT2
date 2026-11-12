import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import axios from 'axios';
import { getPerfil, login as loginReq, registrar as registrarReq, onUnauthorized } from '../services/api';
import { clearAuthSession, loadAuthSession, saveAuthSession } from '../services/storage';
import type { UsuarioAutenticado } from '../types';

interface AuthContextValue {
  user: UsuarioAutenticado | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UsuarioAutenticado | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const sair = async () => {
      await clearAuthSession();
      setUser(null);
    };
    onUnauthorized(sair);

    // Restaura a sessão salva e confirma o token na API (/auth/me)
    (async () => {
      const salvo = await loadAuthSession();
      if (salvo) {
        setUser(salvo);
        try {
          const { data } = await getPerfil();
          setUser(data);
        } catch (erro) {
          // 401: token inválido, encerra a sessão. Sem resposta (API fora): mantém a sessão salva
          if (axios.isAxiosError(erro) && erro.response) await sair();
        }
      }
      setCarregando(false);
    })();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      carregando,
      entrar: async (email, senha) => {
        const { data } = await loginReq(email.trim(), senha);
        await saveAuthSession(data);
        setUser(data.user);
      },
      cadastrar: async (nome, email, senha) => {
        const { data } = await registrarReq(nome.trim(), email.trim(), senha);
        await saveAuthSession(data);
        setUser(data.user);
      },
      sair: async () => {
        await clearAuthSession();
        setUser(null);
      },
    }),
    [user, carregando],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return ctx;
}

// Mesmas regras do painel web
export const podeGerenciarFilmesESalas = (user: UsuarioAutenticado | null) => user?.cargo === 'ADMIN';
export const podeGerenciarSessoesELanches = (user: UsuarioAutenticado | null) =>
  user?.cargo === 'ADMIN' || user?.cargo === 'ATENDENTE';
