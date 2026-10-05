import { useEffect, useMemo, useState } from 'react';
import type { LancheCombo, Pedido, SessaoComDetalhes } from '@/types';
import {
  createPedidoCompleto,
  getApiErrorMessage,
  getLanches,
} from '@/services/api';

interface PedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessao: SessaoComDetalhes | null;
}

interface LancheSelecionado {
  lanche: LancheCombo;
  quantidade: number;
}

const PedidoModal = ({ isOpen, onClose, sessao }: PedidoModalProps) => {
  const [qtInteira, setQtInteira] = useState(0);
  const [qtMeia, setQtMeia] = useState(0);
  const [lanchesDisponiveis, setLanchesDisponiveis] = useState<LancheCombo[]>([]);
  const [lanchesSelecionados, setLanchesSelecionados] = useState<LancheSelecionado[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pedidoCriado, setPedidoCriado] = useState<Pedido | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setQtInteira(0);
    setQtMeia(0);
    setLanchesSelecionados([]);
    setPedidoCriado(null);
    setError('');
    getLanches()
      .then(({ data }) =>
        setLanchesDisponiveis(
          data.filter((lanche) => lanche.ativo !== false && lanche.qtUnidade > 0),
        ),
      )
      .catch((requestError) =>
        setError(getApiErrorMessage(requestError, 'Erro ao carregar lanches.')),
      );
  }, [isOpen]);

  const precoInteira = sessao?.precoBase ?? 40;
  const precoMeia = Math.round((precoInteira / 2) * 100) / 100;
  const totalEstimado = useMemo(() => {
    const totalIngressos = qtInteira * precoInteira + qtMeia * precoMeia;
    const totalLanches = lanchesSelecionados.reduce(
      (total, item) => total + item.lanche.valorUnitario * item.quantidade,
      0,
    );
    return totalIngressos + totalLanches;
  }, [lanchesSelecionados, precoInteira, precoMeia, qtInteira, qtMeia]);

  const handleAddLanche = (lanche: LancheCombo) => {
    setLanchesSelecionados((items) => {
      const selecionado = items.find((item) => item.lanche.id === lanche.id);
      if (!selecionado) return [...items, { lanche, quantidade: 1 }];
      if (selecionado.quantidade >= lanche.qtUnidade) return items;
      return items.map((item) =>
        item.lanche.id === lanche.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item,
      );
    });
  };

  const handleRemoveLanche = (lancheId: number) => {
    setLanchesSelecionados((items) =>
      items
        .map((item) =>
          item.lanche.id === lancheId
            ? { ...item, quantidade: item.quantidade - 1 }
            : item,
        )
        .filter((item) => item.quantidade > 0),
    );
  };

  const handleSubmit = async () => {
    if (!sessao) return;
    setError('');
    setLoading(true);
    try {
      const pedido = await createPedidoCompleto({
        sessaoId: sessao.id,
        qtInteira,
        qtMeia,
        lanches: lanchesSelecionados.map((item) => ({
          lancheId: item.lanche.id,
          quantidade: item.quantidade,
        })),
      });
      setPedidoCriado(pedido);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Erro ao processar o pedido.'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content bg-light border border-primary">
          <div className="modal-header bg-primary text-dark border-0">
            <h5 className="modal-title"><i className="bi bi-bag-plus me-2"></i>Novo Pedido</h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading} aria-label="Fechar"></button>
          </div>
          <div className="modal-body text-dark">
            {pedidoCriado ? (
              <div className="text-center py-5">
                <i className="bi bi-check-circle-fill text-success display-1"></i>
                <h4 className="mt-3 text-success">Pedido realizado com sucesso!</h4>
                <p className="mb-1">Pedido #{pedidoCriado.id}</p>
                <p className="fw-bold">Total: R$ {pedidoCriado.valorTotal.toFixed(2)}</p>
                <button className="btn btn-primary mt-2" onClick={onClose}>Fechar</button>
              </div>
            ) : (
              <div className="row">
                {error && <div className="col-12 alert alert-danger">{error}</div>}
                <div className="col-md-7 border-end border-secondary">
                  <h6 className="fw-bold mb-3">Selecione os ingressos</h6>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Inteira (R$ {precoInteira.toFixed(2)})</span>
                    <input type="number" min="0" className="form-control w-25" value={qtInteira} onChange={(event) => setQtInteira(Math.max(0, Math.floor(Number(event.target.value))))} />
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span>Meia (R$ {precoMeia.toFixed(2)})</span>
                    <input type="number" min="0" className="form-control w-25" value={qtMeia} onChange={(event) => setQtMeia(Math.max(0, Math.floor(Number(event.target.value))))} />
                  </div>
                  <h6 className="fw-bold mb-3">Adicionar lanches</h6>
                  <div className="list-group mb-3">
                    {lanchesDisponiveis.map((lanche) => (
                      <button key={lanche.id} type="button" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center" onClick={() => handleAddLanche(lanche)}>
                        <div className="text-start"><strong>{lanche.nome}</strong><small className="d-block text-muted">Estoque: {lanche.qtUnidade}</small></div>
                        <span className="badge bg-primary text-dark">R$ {lanche.valorUnitario.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-md-5">
                  <h6 className="text-primary mb-3">Resumo do pedido</h6>
                  <div className="card border-0 bg-body-secondary mb-3">
                    <div className="card-body p-2">
                      <small className="d-block"><strong>Filme:</strong> {sessao?.filme?.titulo}</small>
                      <small className="d-block"><strong>Sala:</strong> {sessao?.sala?.numero}</small>
                      <small className="d-block"><strong>Data:</strong> {sessao?.dataHora && new Date(sessao.dataHora).toLocaleString('pt-BR')}</small>
                    </div>
                  </div>
                  <ul className="list-group list-group-flush small mb-3">
                    {qtInteira > 0 && <li className="list-group-item d-flex justify-content-between"><span>{qtInteira}x Inteira</span><span>R$ {(qtInteira * precoInteira).toFixed(2)}</span></li>}
                    {qtMeia > 0 && <li className="list-group-item d-flex justify-content-between"><span>{qtMeia}x Meia</span><span>R$ {(qtMeia * precoMeia).toFixed(2)}</span></li>}
                    {lanchesSelecionados.map((item) => (
                      <li key={item.lanche.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{item.quantidade}x {item.lanche.nome}</span>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveLanche(item.lanche.id)}><i className="bi bi-dash"></i></button>
                      </li>
                    ))}
                  </ul>
                  <div className="alert alert-warning border-primary text-dark">
                    <div className="d-flex justify-content-between align-items-center"><span className="fw-bold">Total estimado:</span><span className="fs-4 fw-bold">R$ {totalEstimado.toFixed(2)}</span></div>
                  </div>
                  <button className="btn btn-success w-100 py-2" onClick={handleSubmit} disabled={loading || totalEstimado === 0}>{loading ? 'Processando...' : 'Finalizar pedido'}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoModal;
