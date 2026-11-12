import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { Botao, Selo, Tela } from '../components/ui';
import { cores } from '../styles/theme';

const descricaoCargo = {
  ADMIN: 'Acesso administrativo completo (usuários, filmes e salas).',
  ATENDENTE: 'Gerencia sessões, lanches, pedidos e ingressos.',
  CLIENTE: 'Consulta de filmes, sessões e lanches.',
};

// Dados reais do usuário logado (vindos de /auth/me)
export default function PerfilScreen() {
  const { user, sair } = useAuth();
  const iniciais = (user?.nome ?? '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <Tela contentStyle={{ alignItems: 'center', paddingTop: 40, gap: 10 }}>
      <View style={s.avatar}><Text style={s.avatarTexto}>{iniciais}</Text></View>
      <Text style={s.nome}>{user?.nome}</Text>
      <Text style={{ color: cores.cinza }}>{user?.email}</Text>
      <Selo texto={user?.cargo} cor={cores.texto} />
      <Text style={{ color: cores.cinza, textAlign: 'center', marginHorizontal: 24 }}>{descricaoCargo[user?.cargo]}</Text>
      <View style={{ height: 16, alignSelf: 'stretch' }} />
      <View style={{ alignSelf: 'stretch' }}>
        <Botao titulo="SAIR" icone="log-out" cor={cores.perigo} onPress={sair} />
      </View>
    </Tela>
  );
}

const s = StyleSheet.create({
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: cores.primaria, justifyContent: 'center', alignItems: 'center' },
  avatarTexto: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  nome: { fontSize: 22, fontWeight: 'bold', color: cores.texto },
});
