import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../auth/AuthContext';
import { cores } from '../styles/theme';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import PerfilScreen from '../screens/PerfilScreen';
import PedidoScreen from '../screens/PedidoScreen';
import { FilmesScreen, FilmeFormScreen } from '../screens/FilmesScreen';
import { SalasScreen, SalaFormScreen } from '../screens/SalasScreen';
import { SessoesScreen, SessaoFormScreen } from '../screens/SessoesScreen';
import { LanchesScreen, LancheFormScreen } from '../screens/LanchesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const cabecalho = {
  headerStyle: { backgroundColor: cores.primaria },
  headerTintColor: '#fff',
};

const icones = {
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
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? icones[route.name] : `${icones[route.name]}-outline`} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} options={{ title: 'CineDev' }} />
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
      <Stack.Navigator screenOptions={cabecalho}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Registro" component={RegisterScreen} options={{ title: 'Cadastro' }} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={cabecalho}>
      <Stack.Screen name="Abas" component={Abas} options={{ headerShown: false }} />
      <Stack.Screen name="Salas" component={SalasScreen} />
      <Stack.Screen name="SalaForm" component={SalaFormScreen} options={({ route }) => ({ title: route.params?.sala ? 'Editar sala' : 'Nova sala' })} />
      <Stack.Screen name="FilmeForm" component={FilmeFormScreen} options={({ route }) => ({ title: route.params?.filme ? 'Editar filme' : 'Novo filme' })} />
      <Stack.Screen name="SessaoForm" component={SessaoFormScreen} options={({ route }) => ({ title: route.params?.sessao ? 'Editar sessão' : 'Nova sessão' })} />
      <Stack.Screen name="LancheForm" component={LancheFormScreen} options={({ route }) => ({ title: route.params?.lanche ? 'Editar lanche' : 'Novo lanche' })} />
      <Stack.Screen name="Pedido" component={PedidoScreen} options={{ title: 'Novo pedido' }} />
    </Stack.Navigator>
  );
}
