import { Platform } from 'react-native';

// Endereço da API do CineDev (backend NestJS).
// - Navegador (web): localhost funciona.
// - Emulador Android: 10.0.2.2 aponta para o computador.
// - Celular físico (Expo Go): use o IP do computador na rede, ex.: 192.168.0.10
//   Defina em mobile/.env:  EXPO_PUBLIC_API_URL=http://192.168.0.10:3000
const padrao = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || padrao;
