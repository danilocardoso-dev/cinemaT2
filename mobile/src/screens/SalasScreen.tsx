import { useState } from 'react';
import { Text, View } from 'react-native';
import { useAuth, podeGerenciarFilmesESalas } from '../auth/AuthContext';
import { excluirSala, getSalas, mensagemDeErro, salvarSala } from '../services/api';
import { salaSchema, errosDoZod, type Erros } from '../schemas/validation';
import { avisar, Botao, Campo, Cartao, confirmar, EstadoLista, Tela, useCarregar } from '../components/ui';
import { cores } from '../styles/theme';
import type { AppScreenProps } from '../navigation/types';
import type { Sala } from '../types';

const buscar = async () => (await getSalas()).data;

export function SalasScreen({ navigation }: AppScreenProps<'Salas'>) {
  const { user } = useAuth();
  const podeEditar = podeGerenciarFilmesESalas(user);
  const { dados, carregando, erro, recarregar } = useCarregar(buscar);

  function excluir(sala: Sala) {
    confirmar(`Excluir a sala ${sala.numero}?`, async () => {
      try {
        await excluirSala(sala.id);
        void recarregar();
      } catch (e) {
        avisar('Erro', mensagemDeErro(e, 'Erro ao excluir sala.'));
      }
    });
  }

  return (
    <Tela>
      {podeEditar && <Botao titulo="Cadastrar sala" icone="add-circle" onPress={() => navigation.navigate('SalaForm')} />}
      <EstadoLista carregando={carregando} erro={erro} recarregar={() => void recarregar()} vazio={dados.length === 0} textoVazio="Nenhuma sala cadastrada." />
      {!carregando && dados.map((s) => (
        <Cartao key={s.id}>
          <Text style={{ fontSize: 17, fontWeight: 'bold', color: cores.texto }}>Sala {s.numero}</Text>
          <Text style={{ color: cores.cinza }}>Capacidade: {s.capacidade} lugares</Text>
          {podeEditar && (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Botao titulo="Editar" icone="create" pequeno onPress={() => navigation.navigate('SalaForm', { sala: s })} />
              <Botao titulo="Excluir" icone="trash" pequeno cor={cores.perigo} onPress={() => excluir(s)} />
            </View>
          )}
        </Cartao>
      ))}
    </Tela>
  );
}

export function SalaFormScreen({ navigation, route }: AppScreenProps<'SalaForm'>) {
  const sala = route.params?.sala;
  const [form, setForm] = useState({ numero: sala ? String(sala.numero) : '', capacidade: sala ? String(sala.capacidade) : '' });
  const [erros, setErros] = useState<Erros>({});
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    const r = salaSchema.safeParse({ numero: Number(form.numero), capacidade: Number(form.capacidade) });
    if (!r.success) return setErros(errosDoZod(r.error));
    setErros({});
    setSalvando(true);
    try {
      await salvarSala({ ...r.data, id: sala?.id });
      navigation.goBack();
    } catch (e) {
      avisar('Erro ao salvar sala', mensagemDeErro(e));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Tela>
      <Campo rotulo="Número da sala" placeholder="Ex: 1" keyboardType="numeric" value={form.numero} onChangeText={(v) => setForm({ ...form, numero: v })} erro={erros.numero} />
      <Campo rotulo="Capacidade" placeholder="Ex: 120" keyboardType="numeric" value={form.capacidade} onChangeText={(v) => setForm({ ...form, capacidade: v })} erro={erros.capacidade} />
      <Botao titulo={sala ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR SALA'} onPress={() => void salvar()} carregando={salvando} />
    </Tela>
  );
}
