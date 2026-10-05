import { useState, useEffect } from 'react';
import { sessaoSchema } from '@/schemas/validation';
import { createSessao, updateSessao, getFilmes, getSalas } from '@/services/api';
import { Filme, Sala, Sessao } from '@/types';

interface SessaoFormProps {
  onSuccess: () => void;
  sessaoEditando: Sessao | null;
  onCancel: () => void;
}

const SessaoForm = ({ onSuccess, sessaoEditando, onCancel }: SessaoFormProps) => {
  const [formData, setFormData] = useState({
    filmeId: '',
    salaId: '',
    dataHora: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filmesRes, salasRes] = await Promise.all([getFilmes(), getSalas()]);
        setFilmes(filmesRes.data);
        setSalas(salasRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (sessaoEditando) {
      setFormData({
        filmeId: String(sessaoEditando.filmeId),
        salaId: String(sessaoEditando.salaId),
        dataHora: new Date(sessaoEditando.dataHora).toLocaleString('sv-SE').slice(0, 16),
      });
    } else {
      setFormData({ filmeId: '', salaId: '', dataHora: '' });
    }
  }, [sessaoEditando]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const dataToValidate = {
      filmeId: Number(formData.filmeId),
      salaId: Number(formData.salaId),
      dataHora: formData.dataHora,
    };

    const result = sessaoSchema.safeParse(dataToValidate);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...result.data,
        dataHora: new Date(result.data.dataHora).toISOString(),
      };
      if (sessaoEditando && sessaoEditando.id) {
        await updateSessao({ ...sessaoEditando, ...payload });
      } else {
        await createSessao(payload);
      }
      setFormData({ filmeId: '', salaId: '', dataHora: '' });
      onSuccess();
    } catch (error) {
      console.error('Erro ao agendar sessão:', error);
      alert('Erro ao agendar sessão. Verifique se o json-server está rodando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-light border-primary">
      <div className="card-header bg-primary text-dark d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className={`bi ${sessaoEditando ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
          {sessaoEditando ? 'Editar Sessão' : 'Agendar Sessão'}
        </h5>
        {sessaoEditando && (
          <button type="button" className="btn btn-sm btn-outline-dark" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label text-dark fw-bold">Filme</label>
              <select
                name="filmeId"
                className={`form-select secondary-bg-rgb text-dark border-0 ${errors.filmeId ? 'is-invalid' : ''}`}
                value={formData.filmeId}
                onChange={handleChange}
              >
                <option value="">Selecione um filme</option>
                {filmes.map((filme) => (
                  <option key={filme.id} value={filme.id}>
                    {filme.titulo}
                  </option>
                ))}
              </select>
              {errors.filmeId && <div className="invalid-feedback">{errors.filmeId}</div>}
              {filmes.length === 0 && (
                <small className="text-danger">
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  Cadastre um filme.
                </small>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label text-dark fw-bold">Sala</label>
              <select
                name="salaId"
                className={`form-select secondary-bg-rgb text-dark border-0 ${errors.salaId ? 'is-invalid' : ''}`}
                value={formData.salaId}
                onChange={handleChange}
              >
                <option value="">Selecione uma sala</option>
                {salas.map((sala) => (
                  <option key={sala.id} value={sala.id}>
                    Sala {sala.numero} ({sala.capacidade} lugares)
                  </option>
                ))}
              </select>
              {errors.salaId && <div className="invalid-feedback">{errors.salaId}</div>}
              {salas.length === 0 && (
                <small className="text-danger">
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  Cadastre uma sala.
                </small>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label text-dark fw-bold">Data e Hora</label>
              <input
                type="datetime-local"
                name="dataHora"
                className={`form-control secondary-bg-rgb text-dark border-0 ${errors.dataHora ? 'is-invalid' : ''}`}
                value={formData.dataHora}
                onChange={handleChange}
              />
              {errors.dataHora && <div className="invalid-feedback">{errors.dataHora}</div>}
            </div>
          </div>

          <div className="d-flex gap-2">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || filmes.length === 0 || salas.length === 0}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Salvando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-2"></i>
                  {sessaoEditando ? 'Salvar Alterações' : 'Agendar Sessão'}
                </>
              )}
            </button>
            {sessaoEditando && (
              <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessaoForm;
