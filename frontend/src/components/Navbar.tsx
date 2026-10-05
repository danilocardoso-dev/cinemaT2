import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const handleSignOut = () => {
    signOut();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary border-bottom border-primary">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <i className="bi bi-film text-dark me-2 fs-4"></i>
          <span className="fw-bold">CineDev</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Alternar navegação"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {[
              { to: '/', icon: 'bi-house-door', label: 'Home' },
              { to: '/filmes', icon: 'bi-camera-reels', label: 'Filmes' },
              { to: '/salas', icon: 'bi-door-open', label: 'Salas' },
              { to: '/lanches', icon: 'bi-basket', label: 'Lanches' },
              { to: '/sessoes', icon: 'bi-bookmark-star', label: 'Sessões' },
            ].map((item) => (
              <li className="nav-item" key={item.to}>
                <Link
                  to={item.to}
                  className={`nav-link ${isActive(item.to) ? 'active text-light' : ''}`}
                >
                  <i className={`bi ${item.icon} me-1`}></i> {item.label}
                </Link>
              </li>
            ))}
            <li className="nav-item ms-lg-3 d-flex align-items-center gap-2">
              <span className="small text-dark">
                {user?.nome}{' '}
                <span className="badge text-bg-dark">{user?.cargo}</span>
              </span>
              <button
                type="button"
                className="btn btn-sm btn-outline-dark"
                onClick={handleSignOut}
              >
                Sair
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
