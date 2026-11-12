import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Filme, Lanche, Sala, Sessao } from '../types';

// Abas principais
export type AbasParamList = {
  'Início': undefined;
  Filmes: undefined;
  'Sessões': undefined;
  Lanches: undefined;
  Perfil: undefined;
};

// Pilha do usuário logado
export type AppStackParamList = {
  Abas: NavigatorScreenParams<AbasParamList>;
  Salas: undefined;
  SalaForm: { sala?: Sala } | undefined;
  FilmeForm: { filme?: Filme } | undefined;
  SessaoForm: { sessao?: Sessao } | undefined;
  LancheForm: { lanche?: Lanche } | undefined;
  Pedido: { sessao: Sessao };
};

// Pilha de quem ainda não entrou
export type AuthStackParamList = {
  Login: undefined;
  Registro: undefined;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<AuthStackParamList, T>;
export type AppScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<AppStackParamList, T>;
// Telas das abas também navegam para a pilha (formulários, pedido)
export type AbaScreenProps<T extends keyof AbasParamList> = CompositeScreenProps<
  BottomTabScreenProps<AbasParamList, T>,
  NativeStackScreenProps<AppStackParamList>
>;
