import { useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { criarPedidoCompleto, getLanches, mensagemDeErro } from '../services/api';
import { Botao, Cartao, Tela } from '../components/ui';
import { cores } from '../styles/theme';
import type { AppScreenProps } from '../navigation/types';
import type { Lanche, Pedido } from '../types';

const real = (n: number) => `R$ ${Number(n).toFixed(2).replace('.', ',')}`;

interface ContadorProps {
  valor: number;
  onMais: () => void;
  onMenos: () => void;
}

function Contador({ valor, onMais, onMenos }: ContadorProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <TouchableOpacity onPress={onMenos} style={{ padding: 4 }}><Ionicons name="remove-circle" size={30} color={cores.cinza} /></TouchableOpacity>
      <Text style={{ fontSize: 18, fontWeight: 'bold', minWidth: 24, textAlign: 'center' }}>{valor}</Text>
      <TouchableOpacity onPress={onMais} style={{ padding: 4 }}><Ionicons name="add-circle" size={30} color={cores.primaria} /></TouchableOpacity>
    </View>
  );
}

// Novo pedido para uma sessão: ingressos + lanches (mesmo fluxo do painel web)
export default function PedidoScreen({ navigation, route }: AppScreenProps<'Pedido'>) {
  const sessao = route.params.sessao;
  const [qtInteira, setQtInteira] = useState(0);
  const [qtMeia, setQtMeia] = useState(0);
  const [lanches, setLanches] = useState<Lanche[]>([]);
  const [escolhidos, setEscolhidos] = useState<Record<number, number>>({}); // lancheId -> quantidade
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [pedido, setPedido] = useState<Pedido | null>(null);

  useEffect(() => {
    getLanches()
      .then(({ data }) => setLanches(data.filter((l) => l.ativo !== false && l.qtUnidade > 0)))
      .catch((e: unknown) => setErro(mensagemDeErro(e, 'Erro ao carregar lanches.')));
  }, []);

  const precoInteira = sessao.precoBase ?? 40;
  const precoMeia = Math.round((precoInteira / 2) * 100) / 100;

  const total = useMemo(() => {
    const ingressos = qtInteira * precoInteira + qtMeia * precoMeia;
    const comidas = lanches.reduce((t, l) => t + l.valorUnitario * (escolhidos[l.id] ?? 0), 0);
    return ingressos + comidas;
  }, [qtInteira, qtMeia, escolhidos, lanches, precoInteira, precoMeia]);

  const alterarLanche = (l: Lanche, delta: number) => {
    const atual = escolhidos[l.id] ?? 0;
    const novo = Math.min(l.qtUnidade, Math.max(0, atual + delta));
    setEscolhidos({ ...escolhidos, [l.id]: novo });
  };

  async function finalizar() {
    setErro('');
    setEnviando(true);
    try {
      const itens = Object.entries(escolhidos)
        .filter(([, q]) => q > 0)
        .map(([id, quantidade]) => ({ lancheId: Number(id), quantidade }));
      setPedido(await criarPedidoCompleto({ sessaoId: sessao.id, qtInteira, qtMeia, lanches: itens }));
    } catch (e) {
      setErro(mensagemDeErro(e, 'Erro ao processar o pedido.'));
    } finally {
      setEnviando(false);
    }
  }

  if (pedido) {
    return (
      <Tela contentStyle={{ alignItems: 'center', paddingTop: 60, gap: 10 }}>
        <Ionicons name="checkmark-circle" size={90} color={cores.sucesso} />
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: cores.sucesso }}>Pedido realizado!</Text>
        <Text>Pedido #{pedido.id}</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Total: {real(pedido.valorTotal)}</Text>
        <View style={{ height: 12 }} />
        <Botao titulo="Voltar às sessões" onPress={() => navigation.goBack()} />
      </Tela>
    );
  }

  return (
    <Tela>
      <Cartao>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{sessao.filme?.titulo}</Text>
        <Text style={{ color: cores.cinza }}>
          Sala {sessao.sala?.numero} · {new Date(sessao.dataHora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
        </Text>
      </Cartao>

      {erro ? <Text style={{ backgroundColor: '#f8d7da', color: '#842029', padding: 10, borderRadius: 8 }}>{erro}</Text> : null}

      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Ingressos</Text>
      <Cartao>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Inteira ({real(precoInteira)})</Text>
          <Contador valor={qtInteira} onMais={() => setQtInteira(qtInteira + 1)} onMenos={() => setQtInteira(Math.max(0, qtInteira - 1))} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Meia ({real(precoMeia)})</Text>
          <Contador valor={qtMeia} onMais={() => setQtMeia(qtMeia + 1)} onMenos={() => setQtMeia(Math.max(0, qtMeia - 1))} />
        </View>
      </Cartao>

      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Lanches</Text>
      {lanches.length === 0 && <Text style={{ color: cores.cinza }}>Nenhum lanche disponível.</Text>}
      {lanches.map((l) => (
        <Cartao key={l.id}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{l.nome}</Text>
              <Text style={{ color: cores.cinza, fontSize: 12 }}>{real(l.valorUnitario)} · estoque {l.qtUnidade}</Text>
            </View>
            <Contador valor={escolhidos[l.id] ?? 0} onMais={() => alterarLanche(l, 1)} onMenos={() => alterarLanche(l, -1)} />
          </View>
        </Cartao>
      ))}

      <Cartao style={{ backgroundColor: '#fff3cd' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontWeight: 'bold' }}>Total estimado</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{real(total)}</Text>
        </View>
      </Cartao>
      <Botao titulo="FINALIZAR PEDIDO" cor={cores.sucesso} onPress={() => void finalizar()} carregando={enviando} desabilitado={total === 0} />
    </Tela>
  );
}
