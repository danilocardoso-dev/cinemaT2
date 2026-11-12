import { useCallback, useState, type ReactNode } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
  type StyleProp, type TextInputProps, type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../styles/theme';
import { mensagemDeErro } from '../services/api';

type NomeIcone = keyof typeof Ionicons.glyphMap;

// ---- Alertas que funcionam no celular e no navegador
export function avisar(titulo: string, mensagem?: string): void {
  if (Platform.OS === 'web') window.alert(mensagem ? `${titulo}\n${mensagem}` : titulo);
  else Alert.alert(titulo, mensagem);
}

export function confirmar(mensagem: string, aoConfirmar: () => void): void {
  if (Platform.OS === 'web') {
    if (window.confirm(mensagem)) aoConfirmar();
    return;
  }
  Alert.alert('Confirmação', mensagem, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Excluir', style: 'destructive', onPress: aoConfirmar },
  ]);
}

// ---- Carrega dados toda vez que a tela ganha foco
export function useCarregar<T>(buscar: () => Promise<T[]>) {
  const [dados, setDados] = useState<T[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const recarregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      setDados(await buscar());
    } catch (e) {
      setErro(mensagemDeErro(e, 'Erro ao carregar os dados.'));
    } finally {
      setCarregando(false);
    }
  }, [buscar]);

  useFocusEffect(
    useCallback(() => {
      void recarregar();
    }, [recarregar]),
  );

  return { dados, carregando, erro, recarregar };
}

// ---- Componentes visuais
interface TelaProps {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}

export function Tela({ children, contentStyle }: TelaProps) {
  return (
    <ScrollView style={s.tela} contentContainerStyle={[s.conteudo, contentStyle]} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

interface BotaoProps {
  titulo: string;
  onPress: () => void;
  cor?: string;
  carregando?: boolean;
  desabilitado?: boolean;
  icone?: NomeIcone;
  pequeno?: boolean;
}

export function Botao({ titulo, onPress, cor = cores.primaria, carregando, desabilitado, icone, pequeno }: BotaoProps) {
  return (
    <TouchableOpacity
      style={[s.botao, pequeno && s.botaoPequeno, { backgroundColor: cor }, (desabilitado || carregando) && { opacity: 0.5 }]}
      onPress={onPress}
      disabled={desabilitado || carregando}
    >
      {carregando ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <View style={s.linha}>
          {icone && <Ionicons name={icone} size={pequeno ? 14 : 18} color="#fff" />}
          <Text style={[s.botaoTexto, pequeno && { fontSize: 13 }]}>{titulo}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

interface CampoProps extends TextInputProps {
  rotulo?: string;
  erro?: string;
}

export function Campo({ rotulo, erro, ...props }: CampoProps) {
  return (
    <View style={{ gap: 4 }}>
      {rotulo && <Text style={s.rotulo}>{rotulo}</Text>}
      <TextInput
        placeholderTextColor={cores.cinza}
        style={[s.input, props.multiline && { height: 90, textAlignVertical: 'top', paddingTop: 12 }, erro ? { borderColor: cores.perigo } : null]}
        {...props}
      />
      {erro ? <Text style={s.erro}>{erro}</Text> : null}
    </View>
  );
}

// Seleção de uma opção entre várias (substitui o <select> do painel)
interface OpcoesProps {
  rotulo?: string;
  opcoes: Array<{ valor: string | number; rotulo: string }>;
  valor: string | number;
  onChange: (valor: string | number) => void;
  erro?: string;
}

export function Opcoes({ rotulo, opcoes, valor, onChange, erro }: OpcoesProps) {
  return (
    <View style={{ gap: 6 }}>
      {rotulo && <Text style={s.rotulo}>{rotulo}</Text>}
      <View style={s.chips}>
        {opcoes.map((o) => {
          const ativo = String(o.valor) === String(valor);
          return (
            <TouchableOpacity key={o.valor} style={[s.chip, ativo && s.chipAtivo]} onPress={() => onChange(o.valor)}>
              <Text style={[s.chipTexto, ativo && { color: '#fff' }]}>{o.rotulo}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {erro ? <Text style={s.erro}>{erro}</Text> : null}
    </View>
  );
}

export function Cartao({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.cartao, style]}>{children}</View>;
}

export function Selo({ texto, cor = cores.primaria }: { texto: string; cor?: string }) {
  return (
    <View style={[s.selo, { backgroundColor: cor }]}>
      <Text style={s.seloTexto}>{texto}</Text>
    </View>
  );
}

interface EstadoListaProps {
  carregando: boolean;
  erro: string;
  vazio: boolean;
  textoVazio: string;
  recarregar: () => void;
}

export function EstadoLista({ carregando, erro, vazio, textoVazio, recarregar }: EstadoListaProps) {
  if (carregando) return <ActivityIndicator style={{ marginTop: 40 }} color={cores.primaria} />;
  if (erro) {
    return (
      <Cartao>
        <Text style={s.erro}>{erro}</Text>
        <Botao titulo="Tentar de novo" onPress={recarregar} pequeno />
      </Cartao>
    );
  }
  if (vazio) return <Text style={s.vazio}>{textoVazio}</Text>;
  return null;
}

export const classificacaoCor: Record<string, string> = {
  Livre: '#198754', '10': '#0dcaf0', '12': '#0d6efd', '14': '#ffc107', '16': '#fd7e14', '18': '#dc3545',
};

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 16, gap: 12 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  botao: { height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 },
  botaoPequeno: { height: 36, borderRadius: 8, paddingHorizontal: 12 },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  rotulo: { fontWeight: 'bold', color: cores.texto },
  input: {
    height: 48, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1,
    borderColor: cores.borda, backgroundColor: cores.branco, color: cores.texto,
  },
  erro: { color: cores.perigo, fontSize: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16, backgroundColor: '#e9ecef' },
  chipAtivo: { backgroundColor: cores.primaria },
  chipTexto: { color: cores.texto, fontSize: 13 },
  cartao: { backgroundColor: cores.branco, borderRadius: 12, padding: 14, gap: 8, borderWidth: 1, borderColor: cores.borda },
  selo: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  seloTexto: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  vazio: { textAlign: 'center', color: cores.cinza, marginTop: 30 },
});
