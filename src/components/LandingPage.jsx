import React from 'react';

function LandingPage({ subPage, onNavigate }) {
  return (
    <main>
      {/* KONDISI 1: Hanya tampilkan bagian Hero/Atas jika subPage bernilai 'beranda' */}
      {subPage === 'beranda' && (
        <section className="landing-hero" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="container landing-hero__grid">
            <div className="landing-hero__copy">
              <span className="eyebrow">PUSAT DOKUMENTASI MATERI DALAM SATU WADAH</span>
              <h1>
                Maksimalkan produktivitas kuliah lewat arsip yang
                <span> terstruktur serta gampang diakses.</span>
              </h1>
              <p>
                Kelola rangkuman materi, agenda tugas, dan inspirasi penting secara terpusat agar tidak berserakan. StudyDesk hadir menjaga ekosistem belajarmu tetap sistematis.
              </p>

              <div className="hero-actions">
                <button className="button button--primary button--large" type="button" onClick={() => onNavigate('register')}>
                  Gabung Sekarang
                </button>
                <button className="button button--secondary button--large" type="button" onClick={() => onNavigate('login')}>
                  Masuk ke Akun Saya
                </button>
              </div>

              <div className="hero-points">
                <div>
                  <strong>Efisien</strong>
                  <span>Tulis gagasan kapan saja.</span>
                </div>
                <div>
                  <strong>Sistematis</strong>
                  <span>Pengelompokan berkas jadi rapi.</span>
                </div>
                <div>
                  <strong>Responsif</strong>
                  <span>Temukan dokumen dalam sekejap.</span>
                </div>
              </div>
            </div>

            <div className="landing-hero__visual" aria-label="Pratinjau StudyDesk">
              <div className="decor-circle decor-circle--one"></div>
              <div className="decor-circle decor-circle--two"></div>

              <div className="preview-window">
                <div className="preview-window__top">
                  <div className="preview-window__brand">
                    <span>SD</span>
                    <div>
                      <strong>StudyDesk</strong>
                      <small>Ruang Kerjaku</small>
                    </div>
                  </div>
                  <div className="preview-avatar">R</div>
                </div>

                <div className="preview-summary">
                  <div>
                    <small>Koleksi Data</small>
                    <strong>18</strong>
                  </div>
                  <div>
                    <small>Aktif</small>
                    <strong>14</strong>
                  </div>
                  <div>
                    <small>Diarsipkan</small>
                    <strong>4</strong>
                  </div>
                </div>

                <div className="preview-note preview-note--blue">
                  <div className="preview-note__row">
                    <span>Modul Kuliah</span>
                    <small>Hari ini</small>
                  </div>
                  <h3>React Fundamental</h3>
                  <p>Component, props, state, dan event handling...</p>
                </div>

                <div className="preview-note">
                  <div className="preview-note__row">
                    <span>Tugas</span>
                    <small>30 Sep</small>
                  </div>
                  <h3>Checklist Front-End</h3>
                  <p>Rapikan responsive layout dan validasi form...</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* KONDISI 2: Hanya tampilkan bagian Fitur jika subPage bernilai 'fitur' */}
      {subPage === 'fitur' && (
        <section className="feature-section" id="features" style={{ animation: 'fadeIn 0.3s ease', padding: '80px 0' }}>
          <div className="container">
            <div className="section-heading section-heading--center">
              <span className="eyebrow">FITUR PENDUKUNG PRODUKTIVITAS</span>
              <h2>Instrumen lengkap untuk mempermudah manajemen informasi Anda.</h2>
              <p>
                Tata letak dirancang minimalis demi menjaga konsentrasi Anda tetap tertuju pada substansi teks, bukan navigasi yang rumit.
              </p>
            </div>

            <div className="feature-grid">
              <article className="feature-card">
                <span className="feature-card__number">01</span>
                <div className="feature-card__icon">✎</div>
                <h3>Pencatatan Instan</h3>
                <p>Dokumentasikan materi, *deadline*, maupun draf pemikiran secara cepat.</p>
              </article>

              <article className="feature-card">
                <span className="feature-card__number">02</span>
                <div className="feature-card__icon">⌕</div>
                <h3>Navigasi Cerdas</h3>
                <p>Fitur filter dan pencarian kata mempermudah penemuan berkas lama.</p>
              </article>

              <article className="feature-card">
                <span className="feature-card__number">03</span>
                <div className="feature-card__icon">☆</div>
                <h3>Sematkan Prioritas</h3>
                <p>Kunci lembar penting agar posisinya senantiasa berada di baris terdepan.</p>
              </article>

              <article className="feature-card">
                <span className="feature-card__number">04</span>
                <div className="feature-card__icon">▣</div>
                <h3>Manajemen Arsip</h3>
                <p>Amankan lembar kerja lama tanpa perlu menghapusnya dari repositori.</p>
              </article>
            </div>
          </div>
        </section>
      )}

      {/* KONDISI 3: Hanya tampilkan bagian Tentang jika subPage bernilai 'tentang' */}
      {subPage === 'tentang' && (
        <section className="about-section" id="about" style={{ animation: 'fadeIn 0.3s ease', padding: '80px 0' }}>
          <div className="container about-grid">
            <div className="about-copy">
              <span className="eyebrow eyebrow--light">StudyDesk</span>
              <h2>Platform sederhana untuk menampung seluruh memori belajar Anda.</h2>
              <p>
                StudyDesk didefinisikan sebagai asisten belajar digital yang taktis: registrasi identitas, ketik konten, kelola label kelompok, cari ulang, dan bereskan data sewaktu masa pakai selesai.
              </p>
            </div>

            <div className="about-steps">
              <div>
                <span>1</span>
                <div>
                  <strong>Aktivasi Akun</strong>
                  <p>Mulai bangun pangkalan data personal Anda.</p>
                </div>
              </div>
              <div>
                <span>2</span>
                <div>
                  <strong>Input Informasi</strong>
                  <p>Isi judul, sematkan label kelompok, dan tuangkan catatan.</p>
                </div>
              </div>
              <div>
                <span>3</span>
                <div>
                  <strong>Kontrol Fleksibel</strong>
                  <p>Perbarui data, cari, sematkan, arsipkan, atau hapus sesuka hati.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default LandingPage;
