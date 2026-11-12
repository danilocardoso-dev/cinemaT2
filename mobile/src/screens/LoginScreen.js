import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../auth/AuthContext';
import { mensagemDeErro } from '../services/api';
import { loginSchema, errosDoZod } from '../schemas/validation';
import { Botao, Campo } from '../components/ui';
import { cores } from '../styles/theme';

export default function LoginScreen({ navigation }) {
  const { entrar } = useAuth();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [erros, setErros] = useState({});
  const [erroApi, setErroApi] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    setErroApi('');
    const r = loginSchema.safeParse(form);
    if (!r.success) return setErros(errosDoZod(r));
    setErros({});
    setCarregando(true);
    try {
      await entrar(form.email, form.senha);
    } catch (e) {
      setErroApi(mensagemDeErro(e, 'Não foi possível entrar.'));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        <View style={s.cabecalho}>
          <View style={s.logo}>
            <Ionicons name="film" size={40} color="#fff" />
          </View>
          <Text style={s.titulo}>
            <Text style={{ color: cores.primaria }}>Cine</Text>Dev
          </Text>
          <Text style={s.subtitulo}>Entre para gerenciar o cinema</Text>
        </View>

        <View style={s.form}>
          {erroApi ? <Text style={s.erroApi}>{erroApi}</Text> : null}
          <Campo rotulo="E-mail" placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none"
            value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} erro={erros.email} />
          <Campo rotulo="Senha" placeholder="Mínimo 6 caracteres" secureTextEntry
            value={form.senha} onChangeText={(v) => setForm({ ...form, senha: v })} erro={erros.senha} />
          <Botao titulo="ENTRAR" onPress={handleLogin} carregando={carregando} />
        </View>

        <View style={s.rodape}>
          <Text>Não tem conta? </Text>
          <Text style={s.link} onPress={() => navigation.navigate('Registro')}>Cadastre-se</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 28, backgroundColor: cores.fundo },
  cabecalho: { alignItems: 'center', gap: 8 },
  logo: { width: 80, height: 80, borderRadius: 40, backgroundColor: cores.primaria, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 30, fontWeight: 'bold', color: cores.texto },
  subtitulo: { color: cores.cinza },
  form: { gap: 12 },
  erroApi: { backgroundColor: '#f8d7da', color: '#842029', padding: 10, borderRadius: 8 },
  rodape: { flexDirection: 'row', justifyContent: 'center' },
  link: { color: cores.primaria, fontWeight: 'bold' },
});
