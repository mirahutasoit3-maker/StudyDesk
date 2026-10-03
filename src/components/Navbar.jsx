import React from 'react';

function Logo() {
  return (
    <div className="brand">
      <span className="brand__mark">SD</span>
      <span>StudyDesk</span>
    </div>
  );
}

function Navbar({ user, subPage, onNavigate, onLogout }) {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <button 
          className="brand-button" 
          type="button" 
          onClick={() => onNavigate(user ? 'dashboard' : 'home', 'beranda')}
        >
          <Logo />
        </button>

        {!user ? (
          <>
            <nav className="site-nav" aria-label="Navigasi utama">
              {/* Tombol menu memicu perpindahan tab sub-konten */}
              <button 
                type="button" 
                style={{ color: subPage === 'beranda' ? 'var(--blue)' : 'inherit' }}
                onClick={() => onNavigate('home', 'beranda')}
              >
                Beranda
              </button>
              
              <button 
                type="button" 
                style={{ color: subPage === 'fitur' ? 'var(--blue)' : 'inherit' }}
                onClick={() => onNavigate('home', 'fitur')}
              >
                Fitur
              </button>
              
              <button 
                type="button" 
                style={{ color: subPage === 'tentang' ? 'var(--blue)' : 'inherit' }}
                onClick={() => onNavigate('home', 'tentang')}
              >
                Tentang
              </button>
            </nav>

            <div className="header-actions">
              <button className="button button--ghost button--small" type="button" onClick={() => onNavigate('login')}>
                Masuk
              </button>
              <button className="button button--primary button--small" type="button" onClick={() => onNavigate('register')}>
                Daftar
              </button>
            </div>
          </>
        ) : (
          <div className="header-user">
            <div className="header-user__text">
              <span>Halo,</span>
              <strong>{user.name.split(' ')}</strong>
            </div>
            <button className="button button--ghost button--small" type="button" onClick={onLogout}>
              Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
