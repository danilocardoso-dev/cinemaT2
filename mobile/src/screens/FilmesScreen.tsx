import { useState } from 'react';
import { Text, View } from 'react-native';
import { useAuth, podeGerenciarFilmesESalas } from '../auth/AuthContext';
import { excluirFilme, getFilmes, mensagemDeErro, salvarFilme } from '../services/api';
import { filmeSchema, errosDoZod, type Erros } from '../schemas/validation';
import {
  avisar, Botao, Campo, Cartao, classificacaoCor, confirmar, EstadoLista, Opcoes, Selo, Tela, useCarregar,
} from '../components/ui';
import { cores } from '../styles/theme';
import type { AbaScreenProps, AppScreenProps } from '../navigation/types';
import type { Filme } from '../types';

const classificacoes = ['Livre', '10', '12', '14', '16', '18'].map((c) => ({ valor: c, rotulo: c === 'Livre' ? 'Livre' : `${c} anos` }));
const generos = ['Ação', 'Aventura', 'Comédia', 'Drama', 'Ficção Científica', 'Terror', 'Romance', 'Animação'].map((g) => ({ valor: g, rotulo: g }));

const buscar = async () => (await getFilmes()).data;

export function FilmesScreen({ navigation }: AbaScreenProps<'Filmes'>) {
  const { user } = useAuth();
  const podeEditar = podeGerenciarFilmesESalas(user);
  const { dados, carregando, erro, recarregar } = useCarregar(buscar);

  function excluir(filme: Filme) {
    confirmar(`Excluir o filme "${filme.titulo}"?`, async () => {
      try {
        await excluirFilme(filme.id);
        void recarregar();
      } catch (e) {
        avisar('Erro', mensagemDeErro(e, 'Erro ao excluir filme.'));
      }
    });
  }

  return (
    <Tela>
      {podeEditar && <Botao titulo="Cadastrar filme" icone="add-circle" onPress={() => navigation.navigate('FilmeForm')} />}
      <EstadoLista carregando={carregando} erro={erro} recarregar={() => void recarregar()} vazio={dados.length === 0}
        textoVazio="Nenhum filme cadastrado." />
      {!carregando && dados.map((f) => (
        <Cartao key={f.id}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 17, fontWeight: 'bold', color: cores.texto, flex: 1 }}>{f.titulo}</Text>
            <Selo texto={f.classificacao === 'Livre' ? 'Livre' : `${f.classificacao}+`} cor={classificacaoCor[f.classificacao] ?? cores.cinza} />
          </View>
          <Text style={{ color: cores.cinza }}>{f.genero} · {f.duracao} min</Text>
          <Text numberOfLines={3} style={{ color: cores.texto }}>{f.sinopse}</Text>
          <Text style={{ color: cores.cinza, fontSize: 12 }}>Exibição: {f.datasExibicao}</Text>
          {podeEditar && (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Botao titulo="Editar" icone="create" pequeno onPress={() => navigation.navigate('FilmeForm', { filme: f })} />
              <Botao titulo="Excluir" icone="trash" pequeno cor={cores.perigo} onPress={() => excluir(f)} />
            </View>
          )}
        </Cartao>
      ))}
    </Tela>
  );
}

export function FilmeFormScreen({ navigation, route }: AppScreenProps<'FilmeForm'>) {
  const filme = route.params?.filme;
  const [form, setForm] = useState({
    titulo: filme?.titulo ?? '',
    sinopse: filme?.sinopse ?? '',
    classificacao: filme?.classificacao ?? '',
    duracao: filme ? String(filme.duracao) : '',
    genero: filme?.genero ?? '',
    datasExibicao: filme?.datasExibicao ?? '',
  });
  const [erros, setErros] = useState<Erros>({});
  const [salvando, setSalvando] = useState(false);
  const set = (campo: keyof typeof form) => (valor: string | number) => setForm({ ...form, [campo]: String(valor) });

  async function salvar() {
    const r = filmeSchema.safeParse({ ...form, duracao: Number(form.duracao) });
    if (!r.success) return setErros(errosDoZod(r.error));
    setErros({});
    setSalvando(true);
    try {
      await salvarFilme({ ...r.data, id: filme?.id });
      navigation.goBack();
    } catch (e) {
      avisar('Erro ao salvar filme', mensagemDeErro(e));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Tela>
      <Campo rotulo="Título" placeholder="Digite o título do filme" value={form.titulo} onChangeText={set('titulo')} erro={erros.titulo} />
      <Campo rotulo="Duração (min)" placeholder="Ex: 120" keyboardType="numeric" value={form.duracao} onChangeText={set('duracao')} erro={erros.duracao} />
      <Opcoes rotulo="Classificação" opcoes={classificacoes} valor={form.classificacao} onChange={set('classificacao')} erro={erros.classificacao} />
      <Opcoes rotulo="Gênero" opcoes={generos} valor={form.genero} onChange={set('genero')} erro={erros.genero} />
      <Campo rotulo="Datas de exibição" placeholder="Ex: 30/07/2026 a 30/08/2026" value={form.datasExibicao} onChangeText={set('datasExibicao')} erro={erros.datasExibicao} />
      <Campo rotulo="Sinopse" placeholder="Descreva o filme (mín. 10 caracteres)" multiline value={form.sinopse} onChangeText={set('sinopse')} erro={erros.sinopse} />
      <Botao titulo={filme ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR FILME'} onPress={() => void salvar()} carregando={salvando} />
    </Tela>
  );
}
