import type { AuthResponse, UsuarioAutenticado } from '@/types';

const TOKEN_KEY = 'cinema.access_token';
const USER_KEY = 'cinema.user';

export function saveAuthSession(auth: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, auth.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): UsuarioAutenticado | null {
  const rawUser = localStorage.getItem(USER_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as UsuarioAutenticado;
  } catch {
    clearAuthSession();
    return null;
  }
}
