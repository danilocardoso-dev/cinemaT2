import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import LancheForm from '@/components/LanchesForm';
import LanchesList from '@/components/LanchesList';
import { getLanches } from '@/services/api';
import { LancheCombo } from '@/types';
import { useAuth } from '@/auth/AuthContext';

const Lanches = () => {
  const { user } = useAuth();
  const canManage = user?.cargo === 'ADMIN' || user?.cargo === 'ATENDENTE';
  const [lanches, setLanches] = useState<LancheCombo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lancheEditando, setLancheEditando] = useState<LancheCombo | null>(null);

  const fetchLanches = async () => {
    try {
      const response = await getLanches();
      setLanches(response.data);
    } catch (error) {
      console.error('Erro ao carregar lanches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanches();
  }, []);

  const handleSuccess = () => {
    fetchLanches();
    setLancheEditando(null);
  };

  const handleCancel = () => {
    setLancheEditando(null);
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container py-4">
        <div className="d-flex align-items-center mb-4">
          <i className="bi bi-basket text-primary display-5 me-3"></i>
          <div>
            <h1 className="text-dark mb-0">Lanches</h1>
            <p className="text-secondary mb-0">Gerencie a bomboniere do seu cinema</p>
          </div>
        </div>

        {canManage && <div className="row">
          <div className="col-12 mb-4">
            <LancheForm onSuccess={handleSuccess} lancheEditando={lancheEditando} onCancel={handleCancel} />
          </div>
        </div>}

        <div className="row">
          <div className="col-12">
            {!loading && <LanchesList lanches={lanches} canManage={canManage} onDelete={fetchLanches} onEdit={(l) => { setLancheEditando(l); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lanches;
