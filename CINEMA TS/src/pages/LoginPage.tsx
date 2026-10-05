import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { getApiErrorMessage } from '@/services/api';

const LoginPage = () => {
  const { user, loading: authLoading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const destination =
    (location.state as { from?: string } | null)?.from ?? '/';

  if (!authLoading && user) return <Navigate to={destination} replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, senha);
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'E-mail ou senha inválidos.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-10 col-md-7 col-lg-5 col-xl-4">
            <div className="card border-primary shadow-sm">
              <div className="card-header bg-primary text-dark text-center py-4">
                <i className="bi bi-film fs-1 d-block mb-2"></i>
                <h1 className="h3 mb-0">CineDev</h1>
                <small>Acesso ao gerenciamento do cinema</small>
              </div>
              <div className="card-body p-4">
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-bold">
                      E-mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="username"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="senha" className="form-label fw-bold">
                      Senha
                    </label>
                    <input
                      id="senha"
                      type="password"
                      className="form-control"
                      value={senha}
                      onChange={(event) => setSenha(event.target.value)}
                      autoComplete="current-password"
                      minLength={6}
                      required
                    />
                  </div>
                  <button className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
