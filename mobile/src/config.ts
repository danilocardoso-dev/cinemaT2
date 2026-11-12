import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Endereço da API do CineDev (backend NestJS, porta 3000).
// Ordem de escolha:
// 1. EXPO_PUBLIC_API_URL (mobile/.env), se definido;
// 2. no celular/emulador: o mesmo IP do computador que serve o app (Metro),
//    descoberto automaticamente (funciona no Expo Go em celular físico);
// 3. no navegador: localhost.
function descobrirUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  if (Platform.OS === 'web') return 'http://localhost:3000';

  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0];
  if (host) return `http://${host}:3000`;

  return Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
}

export const API_URL = descobrirUrl();
