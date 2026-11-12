import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getPerfil, login as loginReq, registrar as registrarReq, onUnauthorized } from '../services/api';
import { clearAuthSession, loadAuthSession, saveAuthSession } from '../services/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
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
          if (erro.response?.status === 401 || !erro.response) {
            // 401: token inválido. Sem resposta: mantém a sessão salva e deixa a tela tratar o erro
            if (erro.response) await sair();
          }
        }
      }
      setCarregando(false);
    })();
  }, []);

  const value = useMemo(
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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return ctx;
}

// Mesmas regras do painel web
export const podeGerenciarFilmesESalas = (user) => user?.cargo === 'ADMIN';
export const podeGerenciarSessoesELanches = (user) => user?.cargo === 'ADMIN' || user?.cargo === 'ATENDENTE';
