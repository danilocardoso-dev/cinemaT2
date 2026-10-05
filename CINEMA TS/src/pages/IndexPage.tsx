import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Index = () => {
  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f8f9faaf' }}>
      <Navbar />
      <section className="py-5 flex-grow-1 d-flex align-items-center" style={{ backgroundColor: '#f8f9faaf' }}>
        <div className="container">
          <div className="row align-items-top">
            <div className="col-lg-6">
              <div className="mb-4">
                <span className="text-primary fw-bold mb-2 d-inline-block fs-1">
                  Sistema de Gerenciamento
                </span>
                <h1 className="display-4 fw-light mb-4">
                  <i className="bi bi-camera-reels text-black display-5 me-3"></i>
                  <span className="text-primary">Cine</span>Dev
                </h1> 
                <p>
                  Bem-vindo ao CineDev.
                </p>
                <p className='lead text-muted'>
                  O nosso melhor e mais completo sistema para gerenciar o seu cinema.
                </p>
                <p className='lead text-muted'>
                  Explore as funcionalidades para gerenciar filmes, salas, sessões, ingressos e lanches de forma eficiente e intuitiva.
                </p>
              </div>
              <p className='display-7 fw-bold'> Eficiência: Sistema rárido e responsivo </p>
              <p className='display-7 fw-bold'> Segurança: Dados protegidos </p>
            </div>
            <div className="d-flex flex-wrap col-lg-6 mt-5 mt-lg-0">
              <div className="row g-4">
                {[
                  { icon: 'bi-film', title: 'Filmes', desc: 'Cadastre os filmes', to: '/filmes' },
                  { icon: 'bi-door-open', title: 'Salas', desc: 'Cadastre as salas', to: '/salas' },
                  { icon: 'bi-bookmark-star', title: 'Sessões', desc: 'Agende as sessoes', to: '/sessoes' },
                  { icon: 'bi-ticket-detailed', title: 'Ingressos', desc: 'Venda ingressos', to: '/sessoes' },
                  { icon: 'bi-basket', title: 'Lanches', desc: 'Gerencie a sua bomboniere', to: '/lanches' },
                  { icon: 'bi-people', title: 'Facilidade', desc: 'Interface amigável', to: '/' },
                ].map((item, idx) => (
                  <div className="col-6" key={idx}>
                    <div
                      className="card border shadow-sm h-100"
                      style={{ backgroundColor: '#ffffff', transition: 'transform 0.2s, box-shadow 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <div className="card-body text-center py-4">
                        <i className={`bi ${item.icon} text-primary display-5`}></i>
                        <h5 className="mt-3 mb-2">{item.title}</h5>
                        <p className="text-muted small mb-0">{item.desc}</p>
                        <Link to={item.to} className="stretched-link"></Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-light text-muted py-3 border-top">
        <div className="container text-center">
          <small>
            <i className="bi bi-code-slash me-1"></i>
            CineWeb © 2025 - Trabalho Acadêmico - React + TypeScript + Bootstrap
          </small>
        </div>
      </footer> */}
    </div>
  );
};

export default Index;
