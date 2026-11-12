import { useState } from 'react';
import { Text, View } from 'react-native';
import { useAuth, podeGerenciarSessoesELanches } from '../auth/AuthContext';
import { excluirLanche, getLanches, mensagemDeErro, salvarLanche } from '../services/api';
import { lancheSchema, errosDoZod } from '../schemas/validation';
import { avisar, Botao, Campo, Cartao, confirmar, EstadoLista, Selo, Tela, useCarregar } from '../components/ui';
import { cores } from '../styles/theme';

const buscar = async () => (await getLanches()).data;
const real = (n) => `R$ ${Number(n).toFixed(2).replace('.', ',')}`;

export function LanchesScreen({ navigation }) {
  const { user } = useAuth();
  const podeEditar = podeGerenciarSessoesELanches(user);
  const { dados, carregando, erro, recarregar } = useCarregar(buscar);

  function excluir(l) {
    confirmar(`Excluir "${l.nome}"?`, async () => {
      try {
        await excluirLanche(l.id);
        recarregar();
      } catch (e) {
        avisar('Erro', mensagemDeErro(e, 'Erro ao excluir lanche.'));
      }
    });
  }

  return (
    <Tela>
      {podeEditar && <Botao titulo="Cadastrar lanche" icone="add-circle" onPress={() => navigation.navigate('LancheForm')} />}
      <EstadoLista carregando={carregando} erro={erro} recarregar={recarregar} vazio={dados.length === 0} textoVazio="Nenhum lanche cadastrado." />
      {!carregando && dados.map((l) => (
        <Cartao key={l.id}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
            <Text style={{ fontSize: 17, fontWeight: 'bold', color: cores.texto, flex: 1 }}>{l.nome}</Text>
            <Selo texto={real(l.valorUnitario)} />
          </View>
          <Text style={{ color: cores.texto }}>{l.descricao}</Text>
          <Text style={{ color: l.qtUnidade > 0 ? cores.cinza : cores.perigo }}>
            {l.qtUnidade > 0 ? `Estoque: ${l.qtUnidade}` : 'Sem estoque'}
          </Text>
          {podeEditar && (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Botao titulo="Editar" icone="create" pequeno onPress={() => navigation.navigate('LancheForm', { lanche: l })} />
              <Botao titulo="Excluir" icone="trash" pequeno cor={cores.perigo} onPress={() => excluir(l)} />
            </View>
          )}
        </Cartao>
      ))}
    </Tela>
  );
}

export function LancheFormScreen({ navigation, route }) {
  const lanche = route.params?.lanche;
  const [form, setForm] = useState({
    nome: lanche?.nome ?? '',
    descricao: lanche?.descricao ?? '',
    valorUnitario: lanche ? String(lanche.valorUnitario) : '',
    qtUnidade: lanche ? String(lanche.qtUnidade) : '',
  });
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);
  const set = (campo) => (valor) => setForm({ ...form, [campo]: valor });

  async function salvar() {
    const r = lancheSchema.safeParse({
      ...form,
      valorUnitario: Number(form.valorUnitario.replace(',', '.')),
      qtUnidade: form.qtUnidade === '' ? NaN : Number(form.qtUnidade),
    });
    if (!r.success) return setErros(errosDoZod(r));
    setErros({});
    setSalvando(true);
    try {
      await salvarLanche({ ...r.data, id: lanche?.id });
      navigation.goBack();
    } catch (e) {
      avisar('Erro ao salvar lanche', mensagemDeErro(e));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Tela>
      <Campo rotulo="Nome" placeholder="Ex: Pipoca grande" value={form.nome} onChangeText={set('nome')} erro={erros.nome} />
      <Campo rotulo="Descrição" placeholder="Descreva o item" multiline value={form.descricao} onChangeText={set('descricao')} erro={erros.descricao} />
      <Campo rotulo="Valor unitário (R$)" placeholder="Ex: 18.50" keyboardType="decimal-pad" value={form.valorUnitario} onChangeText={set('valorUnitario')} erro={erros.valorUnitario} />
      <Campo rotulo="Quantidade em estoque" placeholder="Ex: 50" keyboardType="numeric" value={form.qtUnidade} onChangeText={set('qtUnidade')} erro={erros.qtUnidade} />
      <Botao titulo={lanche ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR LANCHE'} onPress={salvar} carregando={salvando} />
    </Tela>
  );
}
