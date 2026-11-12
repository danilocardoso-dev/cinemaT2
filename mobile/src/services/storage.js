import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'cinema.access_token';
const USER_KEY = 'cinema.user';

// Token em memória: o interceptor do axios lê de forma síncrona
let tokenAtual = null;

export function getAccessToken() {
  return tokenAtual;
}

export async function saveAuthSession(auth) {
  tokenAtual = auth.access_token;
  await AsyncStorage.multiSet([
    [TOKEN_KEY, auth.access_token],
    [USER_KEY, JSON.stringify(auth.user)],
  ]);
}

export async function clearAuthSession() {
  tokenAtual = null;
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}

// Carrega a sessão salva ao abrir o app
export async function loadAuthSession() {
  const [[, token], [, user]] = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
  tokenAtual = token;
  if (!token) return null;
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}
