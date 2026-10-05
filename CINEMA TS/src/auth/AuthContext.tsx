import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getProfile, login as loginRequest } from '@/services/api';
import {
  clearAuthSession,
  getAccessToken,
  getStoredUser,
  saveAuthSession,
} from '@/services/auth-storage';
import type { UsuarioAutenticado } from '@/types';

interface AuthContextValue {
  user: UsuarioAutenticado | null;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UsuarioAutenticado | null>(() =>
    getAccessToken() ? getStoredUser() : null,
  );
  const [loading, setLoading] = useState(Boolean(getAccessToken()));

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuthSession();
      setUser(null);
      setLoading(false);
    };
    window.addEventListener('cinema:unauthorized', handleUnauthorized);

    if (getAccessToken()) {
      getProfile()
        .then(({ data }) => setUser(data))
        .catch(handleUnauthorized)
        .finally(() => setLoading(false));
    }

    return () =>
      window.removeEventListener('cinema:unauthorized', handleUnauthorized);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signIn: async (email, senha) => {
        const { data } = await loginRequest(email, senha);
        saveAuthSession(data);
        setUser(data.user);
      },
      signOut: () => {
        clearAuthSession();
        setUser(null);
      },
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// O hook compartilha o mesmo contexto do provider por design.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}
