import { Sala } from '@/types';
import { deleteSala } from '@/services/api';

interface SalasListProps {
  salas: Sala[];
  canManage: boolean;
  onDelete: () => void;
  onEdit: (sala: Sala) => void;
}

const SalasList = ({ salas, canManage, onDelete, onEdit }: SalasListProps) => {
  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta sala?')) {
      try {
        await deleteSala(id);
        onDelete();
      } catch (error) {
        console.error('Erro ao deletar sala:', error);
        alert('Erro ao deletar sala.');
      }
    }
  };

  if (salas.length === 0) {
    return (
      <div className="alert alert-secondary text-center">
        <i className="bi bi-door-open me-2"></i>
        Nenhuma sala cadastrada. Adicione uma sala usando o formulário acima.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-light table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th className="text-dark">
              Sala
            </th>
            <th className="text-dark">
              <i className="bi bi-people me-1"></i>
              Capacidade
            </th>
            <th className="text-dark text-end">Ações</th>
          </tr>
        </thead>
        <tbody>
          {salas.map((sala) => (
            <tr key={sala.id}>
              <td>
                <span className="badge bg-primary text-dark fs-6">
                  Sala {sala.numero}
                </span>
              </td>
              <td>
                <i className="bi bi-people me-1 text-secondary"></i>
                {sala.capacidade} lugares
              </td>
              <td className="text-end">
                {canManage && <div className="btn-group">
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => onEdit(sala)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => sala.id && handleDelete(sala.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalasList;
