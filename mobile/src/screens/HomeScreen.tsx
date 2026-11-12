import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, podeGerenciarSessoesELanches } from '../auth/AuthContext';
import { Selo, Tela } from '../components/ui';
import { cores } from '../styles/theme';
import type { AbaScreenProps } from '../navigation/types';

interface Atalho {
  icone: keyof typeof Ionicons.glyphMap;
  titulo: string;
  desc: string;
  destino: 'Filmes' | 'Salas' | 'Sessões' | 'Lanches';
  soEquipe?: boolean;
}

// Atalhos do painel web: Filmes, Salas, Sessões, Ingressos, Lanches
const atalhos: Atalho[] = [
  { icone: 'film', titulo: 'Filmes', desc: 'Catálogo de filmes', destino: 'Filmes' },
  { icone: 'business', titulo: 'Salas', desc: 'Salas do cinema', destino: 'Salas' },
  { icone: 'calendar', titulo: 'Sessões', desc: 'Horários e sessões', destino: 'Sessões' },
  { icone: 'ticket', titulo: 'Ingressos', desc: 'Venda ingressos', destino: 'Sessões', soEquipe: true },
  { icone: 'fast-food', titulo: 'Lanches', desc: 'Bomboniere', destino: 'Lanches' },
];

export default function HomeScreen({ navigation }: AbaScreenProps<'Início'>) {
  const { user } = useAuth();
  const equipe = podeGerenciarSessoesELanches(user);
  const lista = atalhos.filter((a) => !a.soEquipe || equipe);

  return (
    <Tela>
      <View style={s.topo}>
        <View style={{ flex: 1 }}>
          <Text style={s.ola}>Olá, {user?.nome.split(' ')[0]}!</Text>
          <Text style={s.sub}>Bem-vindo ao CineDev</Text>
        </View>
        {user && <Selo texto={user.cargo} cor={cores.texto} />}
      </View>

      <View style={s.grade}>
        {lista.map((a) => (
          <TouchableOpacity key={a.titulo} style={s.atalho} onPress={() => navigation.navigate(a.destino as never)}>
            <Ionicons name={a.icone} size={34} color={cores.primaria} />
            <Text style={s.atalhoTitulo}>{a.titulo}</Text>
            <Text style={s.atalhoDesc}>{a.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Tela>
  );
}

const s = StyleSheet.create({
  topo: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 8 },
  ola: { fontSize: 24, fontWeight: 'bold', color: cores.texto },
  sub: { color: cores.cinza },
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  atalho: {
    width: '48%', backgroundColor: cores.branco, borderRadius: 12, borderWidth: 1, borderColor: cores.borda,
    padding: 16, alignItems: 'center', gap: 6,
  },
  atalhoTitulo: { fontWeight: 'bold', fontSize: 16, color: cores.texto },
  atalhoDesc: { color: cores.cinza, fontSize: 12, textAlign: 'center' },
});
