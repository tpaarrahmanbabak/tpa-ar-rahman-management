const STORAGE_KEY = 'tpa-ar-rahman-state-v1';

const defaultState = {
  auth: {
    loggedIn: false,
    role: null,
    username: null
  },
  currentPage: 'dashboard',
  profile: {
    nama: 'TPA Ar-Rahman',
    alamat: 'Jl. Melati No. 24, Kelurahan Asemjajar, Kota Bandung',
    tanggalBerdiri: '2014-01-15',
    sejarah: 'TPA Ar-Rahman berdiri untuk menyiapkan generasi muda yang kuat dalam akidah, hafalan Al-Qur\'an, dan akhlak mulia.',
    tagline: 'Membentuk Generasi Qurani yang Berakhlak Mulia',
    logo: ''
  },
  santri: [
    {
      id: 1,
      nama: 'Ahmad Farhan',
      nis: '2024-001',
      ttl: '2014-03-10',
      alamat: 'Jl. Kenanga 12',
      wali: 'Bapak Sulaiman',
      tingkatan: 'Dasar (Iqra\')',
      status: 'Aktif'
    },
    {
      id: 2,
      nama: 'Nur Aisyah',
      nis: '2024-002',
      ttl: '2013-11-08',
      alamat: 'Jl. Mawar 27',
      wali: 'Ibu Rahma',
      tingkatan: 'Menengah (Baca Al-Qur\'an)',
      status: 'Aktif'
    },
    {
      id: 3,
      nama: 'M. Zaid',
      nis: '2024-003',
      ttl: '2012-06-12',
      alamat: 'Jl. Cendana 45',
      wali: 'Bapak Irfan',
      tingkatan: 'Lanjutan (Tahfidz 30 Juz)',
      status: 'Aktif'
    }
  ],
  organisasi: [
    {
      id: 1,
      role: 'Pengajar Tahfidz',
      nama: 'Ustadz H. Taufik',
      foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      role: 'Pengajar Tilawah',
      nama: 'Ustadzah Siti Aisyah',
      foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      role: 'Ketua Pengurus',
      nama: 'Bapak Rizki',
      foto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
    }
  ],
  attendance: [
    { nama: 'Ahmad Farhan', tanggal: '2026-10-09', status: 'Hadir' },
    { nama: 'Nur Aisyah', tanggal: '2026-10-09', status: 'Hadir' },
    { nama: 'M. Zaid', tanggal: '2026-10-09', status: 'Izin' },
    { nama: 'Ahmad Farhan', tanggal: '2026-10-10', status: 'Hadir' },
    { nama: 'Nur Aisyah', tanggal: '2026-10-10', status: 'Alpha' },
    { nama: 'M. Zaid', tanggal: '2026-10-10', status: 'Hadir' }
  ],
  ukt: [
    {
      id: 1,
      nama: 'Ahmad Farhan',
      level: 'Dasar (Iqra\')',
      bacaan: 82,
      hafalan: 78,
      tauhid: 80,
      fiqih: 76
    },
    {
      id: 2,
      nama: 'Nur Aisyah',
      level: 'Menengah (Baca Al-Qur\'an)',
      bacaan: 88,
      hafalan: 84,
      tauhid: 79,
      fiqih: 81
    },
    {
      id: 3,
      nama: 'M. Zaid',
      level: 'Lanjutan (Tahfidz 30 Juz)',
      bacaan: 90,
      hafalan: 94,
      tauhid: 86,
      fiqih: 88
    }
  ],
  account: {
    adminName: 'Admin TPA',
    adminEmail: 'admin@tpa-arrahman.sch.id'
  }
};

const app = document.getElementById('app');
let state = loadState();

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? { ...defaultState, ...JSON.parse(saved) } : JSON.parse(JSON.stringify(defaultState));
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setPage(page) {
  state.currentPage = page;
  saveState();
  render();
}

function login(username, password) {
  const normalizedUser = String(username).trim().toLowerCase();
  const normalizedPass = String(password).trim();

  if (normalizedUser === 'admin' && normalizedPass === 'Kevinganteng313') {
    state.auth = { loggedIn: true, role: 'admin', username: 'admin' };
    saveState();
    render();
    return;
  }

  if (normalizedUser === 'wali santri' && normalizedPass === 'walisantri123') {
    state.auth = { loggedIn: true, role: 'wali', username: 'wali santri' };
    saveState();
    render();
    return;
  }

  throw new Error('ID atau password tidak valid.');
}

function logout() {
  state.auth = { loggedIn: false, role: null, username: null };
  saveState();
  render();
}

function addStudent(event) {
  event.preventDefault();
  const form = event.target;
  const payload = {
    id: Date.now(),
    nama: form.nama.value.trim(),
    nis: form.nis.value.trim(),
    ttl: form.ttl.value,
    alamat: form.alamat.value.trim(),
    wali: form.wali.value.trim(),
    tingkatan: form.tingkatan.value,
    status: form.status.value
  };

  if (!payload.nama || !payload.nis) {
    alert('Nama dan NIS wajib diisi.');
    return;
  }

  state.santri.unshift(payload);
  saveState();
  render();
  form.reset();
}

function removeStudent(id) {
  state.santri = state.santri.filter((item) => item.id !== id);
  state.ukt = state.ukt.filter((item) => item.nama !== (state.santri.find((s) => s.id === id)?.nama || ''));
  saveState();
  render();
}

function saveProfile(event) {
  event.preventDefault();
  const form = event.target;
  state.profile = {
    ...state.profile,
    nama: form.nama.value.trim(),
    alamat: form.alamat.value.trim(),
    tanggalBerdiri: form.tanggalBerdiri.value,
    sejarah: form.sejarah.value.trim(),
    tagline: form.tagline.value.trim(),
    logo: state.profile.logo || ''
  };
  saveState();
  render();
}

function handleLogoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    state.profile.logo = e.target.result;
    saveState();
    render();
  };
  reader.readAsDataURL(file);
}

function addOrg(event) {
  event.preventDefault();
  const form = event.target;
  const item = {
    id: Date.now(),
    nama: form.nama.value.trim(),
    role: form.role.value.trim(),
    foto: form.foto.value.trim() || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
  };

  if (!item.nama || !item.role) {
    alert('Nama dan posisi wajib diisi.');
    return;
  }

  state.organisasi.unshift(item);
  saveState();
  render();
  form.reset();
}

function addUktScore(event) {
  event.preventDefault();
  const form = event.target;
  const nama = form.nama.value;
  const existingIndex = state.ukt.findIndex((item) => item.nama === nama);
  const score = {
    id: existingIndex >= 0 ? state.ukt[existingIndex].id : Date.now(),
    nama,
    level: form.level.value,
    bacaan: Number(form.bacaan.value),
    hafalan: Number(form.hafalan.value),
    tauhid: Number(form.tauhid.value),
    fiqih: Number(form.fiqih.value)
  };

  if (existingIndex >= 0) {
    state.ukt[existingIndex] = score;
  } else {
    state.ukt.unshift(score);
  }

  saveState();
  render();
  form.reset();
}

function calculateAverage(score) {
  const values = [score.bacaan, score.hafalan, score.tauhid, score.fiqih];
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function getStatusFromAverage(avg) {
  return avg >= 75 ? 'Lulus' : 'Remedial';
}

function buildCardPreview() {
  const toName = document.getElementById('cardTo')?.value || 'Sahabat TPA';
  const title = document.getElementById('cardTitle')?.value || 'Selamat Hari Raya';
  const message = document.getElementById('cardMessage')?.value || 'Semoga kebahagiaan dan keberkahan selalu menyertai Anda.';
  const color1 = document.getElementById('startColor')?.value || '#176c4c';
  const color2 = document.getElementById('endColor')?.value || '#f1c84c';

  const preview = document.getElementById('cardPreview');
  if (!preview) return;

  preview.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
  preview.style.color = '#fff';
  preview.innerHTML = `
    <div class="card-top">
      <div>
        <div class="card-salutation">Kepada</div>
        <div class="card-title">${escapeHtml(title)}</div>
      </div>
      <div class="card-brand">TPA Ar-Rahman</div>
    </div>
    <div class="card-message">${escapeHtml(message)}</div>
    <div class="card-footer">
      <div>
        <div class="card-salutation">Untuk</div>
        <div class="card-signature">${escapeHtml(toName)}</div>
      </div>
      <div class="card-brand">Semoga berkah</div>
    </div>
  `;
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function downloadCardImage() {
  const preview = document.getElementById('cardPreview');
  if (!preview) return;

  html2canvas(preview).then((canvas) => {
    const link = document.createElement('a');
    link.download = 'kartu-ucapan-tpa-ar-rahman.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}

function exportPdf(type) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  if (type === 'santri') {
    doc.setFontSize(16);
    doc.text('Data Santri TPA Ar-Rahman', 14, 18);
    const rows = state.santri.map((item) => [item.nama, item.nis, item.tingkatan, item.wali, item.status]);
    doc.autoTable({
      head: [['Nama', 'NIS', 'Tingkatan', 'Wali', 'Status']],
      body: rows,
      startY: 26,
      theme: 'grid'
    });
  }

  if (type === 'absensi') {
    doc.setFontSize(16);
    doc.text('Absensi Santri TPA Ar-Rahman', 14, 18);
    const rows = state.attendance.map((item) => [item.nama, item.tanggal, item.status]);
    doc.autoTable({
      head: [['Nama', 'Tanggal', 'Status']],
      body: rows,
      startY: 26,
      theme: 'grid'
    });
  }

  if (type === 'ukt') {
    doc.setFontSize(16);
    doc.text('Leger Nilai UKT TPA Ar-Rahman', 14, 18);
    const rows = state.ukt.map((item) => {
      const avg = calculateAverage(item);
      return [item.nama, item.level, item.bacaan, item.hafalan, item.tauhid, item.fiqih, avg, getStatusFromAverage(avg)];
    });
    doc.autoTable({
      head: [['Nama', 'Level', 'Bacaan', 'Hafalan', 'Tauhid', 'Fiqih', 'Rata-rata', 'Status']],
      body: rows,
      startY: 26,
      theme: 'grid'
    });
  }

  if (type === 'rapor') {
    doc.setFontSize(16);
    doc.text('Rapor Santri TPA Ar-Rahman', 14, 18);
    const rows = state.santri.map((santri) => {
      const nilai = state.ukt.find((item) => item.nama === santri.nama);
      const avg = nilai ? calculateAverage(nilai) : 0;
      return [santri.nama, santri.tingkatan, avg >= 75 ? 'Naik Tingkat' : 'Perlu Remedial', avg];
    });
    doc.autoTable({
      head: [['Nama', 'Tingkatan', 'Predikat', 'Nilai Akhir']],
      body: rows,
      startY: 26,
      theme: 'grid'
    });
  }

  const filename = {
    santri: 'data-santri.pdf',
    absensi: 'absensi-santri.pdf',
    ukt: 'leger-nilai-ukt.pdf',
    rapor: 'rapor-santri.pdf'
  }[type];

  doc.save(filename);
}

function renderLogin() {
  return `
    <div class="login-screen">
      <div class="login-visual">
        <div class="login-visual-inner">
          <div class="logo-badge">A</div>
          <h1>TPA Ar-Rahman</h1>
          <p>Platform digital untuk mengelola santri, pembelajaran, dan pelaporan kegiatan TPA.</p>
          <div class="feature-list">
            <div class="feature-list-item"><span class="feature-dot"></span> Dashboard & navigasi cepat</div>
            <div class="feature-list-item"><span class="feature-dot"></span> Pendaftaran santri terstruktur</div>
            <div class="feature-list-item"><span class="feature-dot"></span> Penilaian UKT dan laporan PDF</div>
          </div>
        </div>
      </div>
      <div class="login-panel">
        <div class="card login-card">
          <h2>Masuk</h2>
          <p class="subtle">Akses portal TPA sesuai role Anda.</p>
          <form id="loginForm" class="form-grid">
            <div class="field">
              <label for="loginUser">ID Pengguna</label>
              <input id="loginUser" name="username" type="text" placeholder="Masukkan ID" required />
            </div>
            <div class="field">
              <label for="loginPass">Password</label>
              <input id="loginPass" name="password" type="password" placeholder="Masukkan password" required />
            </div>
            <button class="primary-btn" type="submit">Login</button>
            <div id="loginError" class="warning-text"></div>
          </form>
        </div>
      </div>
    </div>
  `;
}

function renderAppShell() {
  const role = state.auth.role;
  const navItems = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'santri', label: 'Pendaftaran Santri' },
    { key: 'profile', label: 'Profil TPA' },
    { key: 'struktur', label: 'Struktur Organisasi' },
    { key: 'card', label: 'Kartu Ucapan' },
    { key: 'ukt', label: 'Penilaian UKT' },
    { key: 'export', label: 'Export & PDF' }
  ];

  if (role === 'admin') {
    navItems.push({ key: 'account', label: 'Akun' });
  }

  return `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo">A</div>
          <div>
            <div class="sidebar-title">TPA Ar-Rahman</div>
            <div class="sidebar-subtitle">${state.profile.tagline}</div>
          </div>
        </div>
        <nav class="nav-list">
          ${navItems
            .map(
              (item) => `
                <button data-page="${item.key}" class="nav-btn ${state.currentPage === item.key ? 'active' : ''}">
                  ${item.label}
                </button>
              `
            )
            .join('')}
        </nav>
      </aside>
      <main class="content">
        <header class="topbar">
          <div>
            <h1>${pageTitle(state.currentPage)}</h1>
          </div>
          <div class="user-badge">
            <span>${role === 'admin' ? 'Admin' : 'Wali Santri'}</span>
            <button class="ghost-btn" id="logoutBtn" type="button">Keluar</button>
          </div>
        </header>
        ${renderCurrentPage()}
      </main>
    </div>
  `;
}

function pageTitle(page) {
  const titles = {
    dashboard: 'Dashboard',
    santri: 'Pendaftaran & Data Santri',
    profile: 'Profil TPA',
    struktur: 'Struktur Organisasi',
    card: 'Pembuat Kartu Ucapan',
    ukt: 'Penilaian UKT',
    export: 'Export & Cetak PDF',
    account: 'Pengaturan Akun'
  };
  return titles[page] || 'Dashboard';
}

function renderCurrentPage() {
  if (state.currentPage === 'santri') return renderSantriPage();
  if (state.currentPage === 'profile') return renderProfilePage();
  if (state.currentPage === 'struktur') return renderStrukturPage();
  if (state.currentPage === 'card') return renderCardPage();
  if (state.currentPage === 'ukt') return renderUktPage();
  if (state.currentPage === 'export') return renderExportPage();
  if (state.currentPage === 'account') return renderAccountPage();
  return renderDashboardPage();
}

function renderDashboardPage() {
  const totalSantri = state.santri.length;
  const totalPengajar = state.organisasi.length;
  const totalLulus = state.ukt.filter((item) => calculateAverage(item) >= 75).length;
  const totalRemedial = state.ukt.filter((item) => calculateAverage(item) < 75).length;

  return `
    <div class="page">
      <section class="stats-grid">
        <div class="stat-box">
          <p class="stat-title">Total Santri</p>
          <p class="stat-value">${totalSantri}</p>
        </div>
        <div class="stat-box">
          <p class="stat-title">Pengajar & Pengurus</p>
          <p class="stat-value">${totalPengajar}</p>
        </div>
        <div class="stat-box">
          <p class="stat-title">Lulus UKT</p>
          <p class="stat-value">${totalLulus}</p>
        </div>
        <div class="stat-box">
          <p class="stat-title">Perlu Remedial</p>
          <p class="stat-value">${totalRemedial}</p>
        </div>
      </section>

      <section class="card-grid">
        <div class="panel">
          <h3>Menu Cepat</h3>
          <div class="card-grid">
            <button class="quick-link" data-page="santri">Pendaftaran Santri</button>
            <button class="quick-link" data-page="profile">Profil TPA</button>
            <button class="quick-link" data-page="struktur">Struktur Organisasi</button>
            <button class="quick-link" data-page="card">Kartu Ucapan</button>
            <button class="quick-link" data-page="ukt">Penilaian UKT</button>
            <button class="quick-link" data-page="export">Export PDF</button>
          </div>
        </div>

        <div class="panel">
          <h3>Informasi TPA</h3>
          <div class="field">
            <label>Nama TPA</label>
            <input value="${escapeHtml(state.profile.nama)}" readonly />
          </div>
          <div class="field mt-2">
            <label>Alamat</label>
            <input value="${escapeHtml(state.profile.alamat)}" readonly />
          </div>
          <div class="field mt-2">
            <label>Tagline</label>
            <input value="${escapeHtml(state.profile.tagline)}" readonly />
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderSantriPage() {
  return `
    <div class="page">
      <div class="two-col">
        <div class="panel">
          <h3>Form Pendaftaran Santri Baru</h3>
          <form id="santriForm" class="form-grid" onsubmit="addStudent(event)">
            <div class="field">
              <label>Nama Lengkap</label>
              <input name="nama" type="text" placeholder="Contoh: Rafi Aulia" required />
            </div>
            <div class="field">
              <label>NIS</label>
              <input name="nis" type="text" placeholder="Contoh: 2024-012" required />
            </div>
            <div class="field">
              <label>Tanggal Lahir</label>
              <input name="ttl" type="date" required />
            </div>
            <div class="field">
              <label>Alamat</label>
              <input name="alamat" type="text" placeholder="Alamat domisili" required />
            </div>
            <div class="field">
              <label>Nama Wali</label>
              <input name="wali" type="text" placeholder="Nama orang tua/wali" required />
            </div>
            <div class="field">
              <label>Tingkatan</label>
              <select name="tingkatan">
                <option>Dasar (Iqra')</option>
                <option>Menengah (Baca Al-Qur'an)</option>
                <option>Lanjutan (Tahfidz 30 Juz)</option>
              </select>
            </div>
            <div class="field">
              <label>Status</label>
              <select name="status">
                <option>Aktif</option>
                <option>Baru</option>
                <option>Non-Aktif</option>
              </select>
            </div>
            <button class="primary-btn" type="submit">Simpan Data Santri</button>
          </form>
        </div>

        <div class="panel">
          <h3>Ringkasan Data Santri</h3>
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Tingkatan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${state.santri.slice(0, 5).map((item) => `
                <tr>
                  <td>${escapeHtml(item.nama)}</td>
                  <td>${escapeHtml(item.tingkatan)}</td>
                  <td><span class="status-tag success">${escapeHtml(item.status)}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel">
        <h3>Daftar Santri</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>NIS</th>
                <th>Tanggal Lahir</th>
                <th>Alamat</th>
                <th>Wali</th>
                <th>Tingkatan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${state.santri.length ? state.santri.map((item) => `
                <tr>
                  <td>${escapeHtml(item.nama)}</td>
                  <td>${escapeHtml(item.nis)}</td>
                  <td>${escapeHtml(item.ttl)}</td>
                  <td>${escapeHtml(item.alamat)}</td>
                  <td>${escapeHtml(item.wali)}</td>
                  <td>${escapeHtml(item.tingkatan)}</td>
                  <td><span class="status-tag success">${escapeHtml(item.status)}</span></td>
                  <td>
                    <div class="mini-actions">
                      <button class="danger-btn" type="button" onclick="removeStudent(${item.id})">Hapus</button>
                    </div>
                  </td>
                </tr>
              `).join('') : `<tr><td colspan="8"><div class="empty-box">Belum ada data santri.</div></td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderProfilePage() {
  return `
    <div class="page">
      <div class="two-col">
        <div class="panel">
          <h3>Pengaturan Profil TPA</h3>
          <form id="profileForm" class="form-grid" onsubmit="saveProfile(event)">
            <div class="field">
              <label>Nama TPA</label>
              <input name="nama" value="${escapeHtml(state.profile.nama)}" required />
            </div>
            <div class="field">
              <label>Alamat</label>
              <textarea name="alamat" rows="3" required>${escapeHtml(state.profile.alamat)}</textarea>
            </div>
            <div class="field">
              <label>Tanggal Berdiri</label>
              <input name="tanggalBerdiri" type="date" value="${state.profile.tanggalBerdiri}" required />
            </div>
            <div class="field">
              <label>Sejarah Singkat</label>
              <textarea name="sejarah" rows="4" required>${escapeHtml(state.profile.sejarah)}</textarea>
            </div>
            <div class="field">
              <label>Tagline</label>
              <input name="tagline" value="${escapeHtml(state.profile.tagline)}" required />
            </div>
            <div class="field">
              <label>Upload Logo</label>
              <input type="file" accept="image/*" onchange="handleLogoUpload(event)" />
            </div>
            <button class="primary-btn" type="submit">Simpan Profil</button>
          </form>
        </div>

        <div class="panel">
          <h3>Preview Profil</h3>
          <div class="logo-preview">
            ${state.profile.logo ? `<img src="${state.profile.logo}" alt="Logo TPA" />` : 'TPA'}
          </div>
          <div class="mt-3">
            <h4>${escapeHtml(state.profile.nama)}</h4>
            <p>${escapeHtml(state.profile.alamat)}</p>
            <p><strong>Berdiri:</strong> ${escapeHtml(state.profile.tanggalBerdiri)}</p>
            <p><strong>Tagline:</strong> ${escapeHtml(state.profile.tagline)}</p>
            <p>${escapeHtml(state.profile.sejarah)}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStrukturPage() {
  return `
    <div class="page">
      <div class="two-col">
        <div class="panel">
          <h3>Tambah Pengajar & Pengurus</h3>
          <form id="orgForm" class="form-grid" onsubmit="addOrg(event)">
            <div class="field">
              <label>Nama</label>
              <input name="nama" type="text" required />
            </div>
            <div class="field">
              <label>Jabatan / Peran</label>
              <input name="role" type="text" required />
            </div>
            <div class="field">
              <label>URL Foto</label>
              <input name="foto" type="url" placeholder="https://..." />
            </div>
            <button class="primary-btn" type="submit">Simpan Data</button>
          </form>
        </div>

        <div class="panel">
          <h3>Organisasi TPA</h3>
          <div class="org-grid">
            ${state.organisasi.length ? state.organisasi.map((item) => `
              <div class="org-card">
                <img src="${item.foto}" alt="${escapeHtml(item.nama)}" />
                <div class="org-body">
                  <h4>${escapeHtml(item.nama)}</h4>
                  <p>${escapeHtml(item.role)}</p>
                </div>
              </div>
            `).join('') : '<div class="empty-box">Belum ada data organisasi.</div>'}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCardPage() {
  return `
    <div class="page">
      <div class="two-col">
        <div class="panel">
          <h3>Pengaturan Kartu Ucapan</h3>
          <div class="form-grid">
            <div class="field">
              <label>Untuk</label>
              <input id="cardTo" type="text" value="Sahabat TPA" />
            </div>
            <div class="field">
              <label>Judul</label>
              <input id="cardTitle" type="text" value="Selamat Hari Raya" />
            </div>
            <div class="field">
              <label>Pesan</label>
              <textarea id="cardMessage" rows="4">Semoga kebahagiaan, keberkahan, dan kebaikan selalu menyertai Anda.</textarea>
            </div>
            <div class="two-col">
              <div class="field">
                <label>Warna Awal</label>
                <input id="startColor" type="color" value="#176c4c" />
              </div>
              <div class="field">
                <label>Warna Akhir</label>
                <input id="endColor" type="color" value="#f1c84c" />
              </div>
            </div>
            <div class="mini-actions">
              <button class="secondary-btn" type="button" onclick="buildCardPreview()">Pratinjau</button>
              <button class="primary-btn" type="button" onclick="downloadCardImage()">Download PNG</button>
            </div>
          </div>
        </div>

        <div class="panel">
          <h3>Preview Kartu Ucapan</h3>
          <div id="cardPreview" class="card-preview" style="background: linear-gradient(135deg, #176c4c, #f1c84c); color: white;">
            <div class="card-top">
              <div>
                <div class="card-salutation">Kepada</div>
                <div class="card-title">Selamat Hari Raya</div>
              </div>
              <div class="card-brand">TPA Ar-Rahman</div>
            </div>
            <div class="card-message">Semoga kebahagiaan, keberkahan, dan kebaikan selalu menyertai Anda.</div>
            <div class="card-footer">
              <div>
                <div class="card-salutation">Untuk</div>
                <div class="card-signature">Sahabat TPA</div>
              </div>
              <div class="card-brand">Semoga berkah</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderUktPage() {
  const students = state.santri.map((item) => ({ name: item.nama }));

  return `
    <div class="page">
      <div class="two-col">
        <div class="panel">
          <h3>Input Nilai UKT</h3>
          <form id="uktForm" class="form-grid" onsubmit="addUktScore(event)">
            <div class="field">
              <label>Nama Santri</label>
              <select name="nama" required>
                ${students.map((student) => `<option value="${escapeHtml(student.name)}">${escapeHtml(student.name)}</option>`).join('')}
              </select>
            </div>
            <div class="field">
              <label>Tingkatan</label>
              <select name="level">
                <option>Dasar (Iqra')</option>
                <option>Menengah (Baca Al-Qur'an)</option>
                <option>Lanjutan (Tahfidz 30 Juz)</option>
              </select>
            </div>
            <div class="field">
              <label>Bacaan</label>
              <input name="bacaan" type="number" min="0" max="100" value="80" required />
            </div>
            <div class="field">
              <label>Hafalan</label>
              <input name="hafalan" type="number" min="0" max="100" value="80" required />
            </div>
            <div class="field">
              <label>Tauhid</label>
              <input name="tauhid" type="number" min="0" max="100" value="80" required />
            </div>
            <div class="field">
              <label>Fiqih</label>
              <input name="fiqih" type="number" min="0" max="100" value="80" required />
            </div>
            <button class="primary-btn" type="submit">Simpan Nilai</button>
          </form>
        </div>

        <div class="panel">
          <h3>Ketentuan Kelulusan</h3>
          <p>Aspek penilaian mencakup Bacaan, Hafalan, Tauhid, dan Fiqih.</p>
          <p>Nilai minimal kelulusan: <strong>75</strong></p>
          <ul>
            <li>Dasar (Iqra')</li>
            <li>Menengah (Baca Al-Qur'an)</li>
            <li>Lanjutan (Tahfidz 30 Juz)</li>
          </ul>
        </div>
      </div>

      <div class="panel">
        <h3>Leger Nilai UKT</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Level</th>
                <th>Bacaan</th>
                <th>Hafalan</th>
                <th>Tauhid</th>
                <th>Fiqih</th>
                <th>Rata-rata</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${state.ukt.length ? state.ukt.map((item) => {
                const avg = calculateAverage(item);
                const status = getStatusFromAverage(avg);
                return `
                  <tr>
                    <td>${escapeHtml(item.nama)}</td>
                    <td>${escapeHtml(item.level)}</td>
                    <td>${item.bacaan}</td>
                    <td>${item.hafalan}</td>
                    <td>${item.tauhid}</td>
                    <td>${item.fiqih}</td>
                    <td>${avg}</td>
                    <td><span class="status-tag ${status === 'Lulus' ? 'success' : 'warning'}">${status}</span></td>
                  </tr>
                `;
              }).join('') : `<tr><td colspan="8"><div class="empty-box">Belum ada data UKT.</div></td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderExportPage() {
  return `
    <div class="page">
      <div class="panel">
        <h3>Eksport & Cetak PDF</h3>
        <div class="card-grid">
          <button class="primary-btn" type="button" onclick="exportPdf('santri')">Download PDF Data Santri</button>
          <button class="primary-btn" type="button" onclick="exportPdf('absensi')">Download PDF Absensi Santri</button>
          <button class="primary-btn" type="button" onclick="exportPdf('ukt')">Download PDF Leger Nilai UKT</button>
          <button class="primary-btn" type="button" onclick="exportPdf('rapor')">Download PDF Rapor Santri</button>
        </div>
      </div>
    </div>
  `;
}

function renderAccountPage() {
  if (state.auth.role !== 'admin') {
    return `<div class="panel"><h3>Halaman terbatas</h3><p>Hanya admin yang dapat mengakses pengaturan akun.</p></div>`;
  }

  return `
    <div class="page">
      <div class="panel">
        <h3>Pengaturan Akun</h3>
        <form class="form-grid">
          <div class="field">
            <label>Nama Admin</label>
            <input value="${escapeHtml(state.account.adminName)}" />
          </div>
          <div class="field">
            <label>Email Admin</label>
            <input value="${escapeHtml(state.account.adminEmail)}" />
          </div>
          <button class="primary-btn" type="button" onclick="alert('Pengaturan akun tersimpan')">Simpan</button>
        </form>
      </div>
    </div>
  `;
}

function attachEvents() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(loginForm);
      try {
        login(form.get('username'), form.get('password'));
      } catch (error) {
        document.getElementById('loginError').textContent = error.message;
      }
    });
  }

  const navButtons = document.querySelectorAll('[data-page]');
  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const page = button.dataset.page;
      if (page) setPage(page);
    });
  });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  const cardInputs = ['cardTo', 'cardTitle', 'cardMessage', 'startColor', 'endColor'];
  cardInputs.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', buildCardPreview);
    if (el) el.addEventListener('change', buildCardPreview);
  });
}

function render() {
  app.innerHTML = state.auth.loggedIn ? renderAppShell() : renderLogin();
  attachEvents();
  if (state.auth.loggedIn && state.currentPage === 'card') {
    buildCardPreview();
  }
}

render();
