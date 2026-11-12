import { useState } from 'react';
import { Text, View } from 'react-native';
import { useAuth, podeGerenciarSessoesELanches } from '../auth/AuthContext';
import { excluirSessao, getFilmes, getSalas, getSessoes, mensagemDeErro, salvarSessao } from '../services/api';
import { sessaoSchema, errosDoZod, type Erros } from '../schemas/validation';
import { avisar, Botao, Campo, Cartao, confirmar, EstadoLista, Opcoes, Selo, Tela, useCarregar } from '../components/ui';
import { cores } from '../styles/theme';
import type { AbaScreenProps, AppScreenProps } from '../navigation/types';
import type { Sessao } from '../types';

const buscar = async () => (await getSessoes()).data;
const buscarFilmes = async () => (await getFilmes()).data;
const buscarSalas = async () => (await getSalas()).data;
const real = (n: number) => `R$ ${Number(n).toFixed(2).replace('.', ',')}`;
const dataBr = (iso: string) => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

// "2026-12-01 19:30" (horário local) <-> Date
const doTexto = (texto: string) => new Date(texto.trim().replace(' ', 'T'));
const paraTexto = (iso: string) => {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

export function SessoesScreen({ navigation }: AbaScreenProps<'Sessões'>) {
  const { user } = useAuth();
  const equipe = podeGerenciarSessoesELanches(user);
  const { dados, carregando, erro, recarregar } = useCarregar(buscar);

  function excluir(s: Sessao) {
    confirmar('Excluir esta sessão?', async () => {
      try {
        await excluirSessao(s.id);
        void recarregar();
      } catch (e) {
        avisar('Erro', mensagemDeErro(e, 'Erro ao excluir sessão.'));
      }
    });
  }

  return (
    <Tela>
      {equipe && <Botao titulo="Agendar sessão" icone="add-circle" onPress={() => navigation.navigate('SessaoForm')} />}
      <EstadoLista carregando={carregando} erro={erro} recarregar={() => void recarregar()} vazio={dados.length === 0} textoVazio="Nenhuma sessão agendada." />
      {!carregando && dados.map((s) => (
        <Cartao key={s.id}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
            <Text style={{ fontSize: 17, fontWeight: 'bold', color: cores.texto, flex: 1 }}>{s.filme?.titulo ?? `Filme #${s.filmeId}`}</Text>
            <Selo texto={real(s.precoBase)} />
          </View>
          <Text style={{ color: cores.cinza }}>Sala {s.sala?.numero ?? s.salaId} · {dataBr(s.dataHora)}</Text>
          {equipe && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <Botao titulo="Vender" icone="ticket" pequeno cor={cores.sucesso} onPress={() => navigation.navigate('Pedido', { sessao: s })} />
              <Botao titulo="Editar" icone="create" pequeno onPress={() => navigation.navigate('SessaoForm', { sessao: s })} />
              <Botao titulo="Excluir" icone="trash" pequeno cor={cores.perigo} onPress={() => excluir(s)} />
            </View>
          )}
        </Cartao>
      ))}
    </Tela>
  );
}

export function SessaoFormScreen({ navigation, route }: AppScreenProps<'SessaoForm'>) {
  const sessao = route.params?.sessao;
  const [form, setForm] = useState({
    filmeId: sessao ? String(sessao.filmeId) : '',
    salaId: sessao ? String(sessao.salaId) : '',
    dataHora: sessao ? paraTexto(sessao.dataHora) : '',
  });
  const [erros, setErros] = useState<Erros>({});
  const [salvando, setSalvando] = useState(false);
  const filmes = useCarregar(buscarFilmes);
  const salas = useCarregar(buscarSalas);

  async function salvar() {
    const r = sessaoSchema.safeParse({
      filmeId: Number(form.filmeId),
      salaId: Number(form.salaId),
      dataHora: form.dataHora ? doTexto(form.dataHora).toString() : '',
    });
    if (!r.success) return setErros(errosDoZod(r.error));
    setErros({});
    setSalvando(true);
    try {
      await salvarSessao({
        id: sessao?.id,
        filmeId: Number(form.filmeId),
        salaId: Number(form.salaId),
        dataHora: doTexto(form.dataHora).toISOString(),
      });
      navigation.goBack();
    } catch (e) {
      avisar('Erro ao salvar sessão', mensagemDeErro(e));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Tela>
      <Opcoes rotulo="Filme" valor={form.filmeId} onChange={(v) => setForm({ ...form, filmeId: String(v) })} erro={erros.filmeId}
        opcoes={filmes.dados.map((f) => ({ valor: f.id, rotulo: f.titulo }))} />
      <Opcoes rotulo="Sala" valor={form.salaId} onChange={(v) => setForm({ ...form, salaId: String(v) })} erro={erros.salaId}
        opcoes={salas.dados.map((s) => ({ valor: s.id, rotulo: `Sala ${s.numero}` }))} />
      <Campo rotulo="Data e hora" placeholder="AAAA-MM-DD HH:mm  (ex: 2026-12-01 19:30)" autoCapitalize="none"
        value={form.dataHora} onChangeText={(v) => setForm({ ...form, dataHora: v })} erro={erros.dataHora} />
      <Botao titulo={sessao ? 'SALVAR ALTERAÇÕES' : 'AGENDAR SESSÃO'} onPress={() => void salvar()} carregando={salvando} />
    </Tela>
  );
}
