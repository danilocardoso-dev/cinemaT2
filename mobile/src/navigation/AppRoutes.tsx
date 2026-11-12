import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../auth/AuthContext';
import { cores } from '../styles/theme';
import type { AbasParamList, AppStackParamList, AuthStackParamList } from './types';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import PerfilScreen from '../screens/PerfilScreen';
import PedidoScreen from '../screens/PedidoScreen';
import { FilmesScreen, FilmeFormScreen } from '../screens/FilmesScreen';
import { SalasScreen, SalaFormScreen } from '../screens/SalasScreen';
import { SessoesScreen, SessaoFormScreen } from '../screens/SessoesScreen';
import { LanchesScreen, LancheFormScreen } from '../screens/LanchesScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<AbasParamList>();

const cabecalho = {
  headerStyle: { backgroundColor: cores.primaria },
  headerTintColor: '#fff',
};

const icones: Record<keyof AbasParamList, 'home' | 'film' | 'calendar' | 'fast-food' | 'person'> = {
  'Início': 'home',
  Filmes: 'film',
  'Sessões': 'calendar',
  Lanches: 'fast-food',
  Perfil: 'person',
};

// Abas principais (equivalentes ao menu do painel web)
function Abas() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...cabecalho,
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.cinza,
        tabBarIcon: ({ focused, color, size }) => {
          const base = icones[route.name];
          return <Ionicons name={focused ? base : (`${base}-outline` as `${typeof base}-outline`)} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} options={{ title: 'CineDev', tabBarLabel: 'Início' }} />
      <Tab.Screen name="Filmes" component={FilmesScreen} />
      <Tab.Screen name="Sessões" component={SessoesScreen} />
      <Tab.Screen name="Lanches" component={LanchesScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

export default function AppRoutes() {
  const { user, carregando } = useAuth();

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  // Sem usuário: só login/cadastro. Com usuário: o app. Ao sair, a pilha troca sozinha.
  if (!user) {
    return (
      <AuthStack.Navigator screenOptions={cabecalho}>
        <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <AuthStack.Screen name="Registro" component={RegisterScreen} options={{ title: 'Cadastro' }} />
      </AuthStack.Navigator>
    );
  }

  return (
    <AppStack.Navigator screenOptions={cabecalho}>
      <AppStack.Screen name="Abas" component={Abas} options={{ headerShown: false }} />
      <AppStack.Screen name="Salas" component={SalasScreen} />
      <AppStack.Screen name="SalaForm" component={SalaFormScreen} options={({ route }) => ({ title: route.params?.sala ? 'Editar sala' : 'Nova sala' })} />
      <AppStack.Screen name="FilmeForm" component={FilmeFormScreen} options={({ route }) => ({ title: route.params?.filme ? 'Editar filme' : 'Novo filme' })} />
      <AppStack.Screen name="SessaoForm" component={SessaoFormScreen} options={({ route }) => ({ title: route.params?.sessao ? 'Editar sessão' : 'Nova sessão' })} />
      <AppStack.Screen name="LancheForm" component={LancheFormScreen} options={({ route }) => ({ title: route.params?.lanche ? 'Editar lanche' : 'Novo lanche' })} />
      <AppStack.Screen name="Pedido" component={PedidoScreen} options={{ title: 'Novo pedido' }} />
    </AppStack.Navigator>
  );
}
