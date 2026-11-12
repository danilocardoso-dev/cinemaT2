import { useState } from 'react';
import { Text, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { mensagemDeErro } from '../services/api';
import { registroSchema, errosDoZod } from '../schemas/validation';
import { Botao, Campo, Tela } from '../components/ui';
import { cores } from '../styles/theme';

export default function RegisterScreen({ navigation }) {
  const { cadastrar } = useAuth();
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmar: '' });
  const [erros, setErros] = useState({});
  const [erroApi, setErroApi] = useState('');
  const [carregando, setCarregando] = useState(false);

  const alterar = (campo, valor) => setForm({ ...form, [campo]: valor });

  async function handleRegistrar() {
    setErroApi('');
    const r = registroSchema.safeParse(form);
    const novos = r.success ? {} : errosDoZod(r);
    if (form.senha !== form.confirmar) novos.confirmar = 'As senhas não conferem';
    setErros(novos);
    if (Object.keys(novos).length) return;

    setCarregando(true);
    try {
      // A API cria a conta como CLIENTE e já devolve o token (entra direto no app)
      await cadastrar(form.nome, form.email, form.senha);
    } catch (e) {
      setErroApi(mensagemDeErro(e, 'Não foi possível criar a conta.'));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Tela contentStyle={{ gap: 12, padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: cores.texto }}>Criar conta</Text>
      <Text style={{ color: cores.cinza, marginBottom: 8 }}>Preencha seus dados</Text>
      {erroApi ? <Text style={{ backgroundColor: '#f8d7da', color: '#842029', padding: 10, borderRadius: 8 }}>{erroApi}</Text> : null}
      <Campo rotulo="Nome completo" placeholder="Seu nome" value={form.nome} onChangeText={(v) => alterar('nome', v)} erro={erros.nome} />
      <Campo rotulo="E-mail" placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none"
        value={form.email} onChangeText={(v) => alterar('email', v)} erro={erros.email} />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Campo rotulo="Senha" placeholder="Senha" secureTextEntry value={form.senha}
            onChangeText={(v) => alterar('senha', v)} erro={erros.senha} />
        </View>
        <View style={{ flex: 1 }}>
          <Campo rotulo="Confirmar" placeholder="Confirmar" secureTextEntry value={form.confirmar}
            onChangeText={(v) => alterar('confirmar', v)} erro={erros.confirmar} />
        </View>
      </View>
      <Botao titulo="CADASTRAR" onPress={handleRegistrar} carregando={carregando} />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text>Já tem conta? </Text>
        <Text style={{ color: cores.primaria, fontWeight: 'bold' }} onPress={() => navigation.goBack()}>Entrar</Text>
      </View>
    </Tela>
  );
}
