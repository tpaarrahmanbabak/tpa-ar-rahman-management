const STORAGE_KEYS = {
  profile: 'tpaArRahmanProfile',
  users: 'tpaArRahmanUsers',
  students: 'tpaArRahmanStudents',
  attendance: 'tpaArRahmanAttendance',
  organization: 'tpaArRahmanOrganization',
  assessments: 'tpaArRahmanAssessments',
};

const DEFAULT_USERS = [
  { id: 'admin', password: 'Kevinganteng313', role: 'Admin', name: 'Administrator' },
  { id: 'wali_santri', password: 'walisantri123', role: 'Wali Santri', name: 'Wali Santri' },
];

const DEFAULT_PROFILE = {
  name: 'TPA Ar-Rahman',
  address: 'Jl. Pendidikan Islam No. 1, Kota Bandung',
  founded: '2015-01-15',
  history:
    'TPA Ar-Rahman didirikan untuk menumbuhkan semangat membaca dan menghafal Al-Qur\'an serta membangun akhlak islami sejak dini.',
  tagline: 'Tumbuhkan kecintaan pada Al-Qur\'an sejak dini.',
  logo: createDefaultLogoDataUri(),
};

const DEFAULT_ORGANIZATION = {
  teachers: [
    { name: 'Ustadzah Siti Aisyah', role: 'Koordinator Dasar' },
    { name: 'Ustadz Rafi Hidayat', role: 'Guru Tahfidz' },
    { name: 'Ustadzah Nabila', role: 'Guru Fiqih' },
  ],
  board: [
    { name: 'Dewi Asih', role: 'Ketua Yayasan' },
    { name: 'Arif Suhaemi', role: 'Sekretaris Umum' },
    { name: 'Maman Hamdani', role: 'Bendahara' },
  ],
};

const DEFAULT_STUDENTS = [
  { id: 'S-001', name: 'Alya Rahma', parent: 'Ibu Siti', dob: '2014-05-01', gender: 'Perempuan', phone: '081234567890', className: 'Dasar A' },
  { id: 'S-002', name: 'Farhan Rizki', parent: 'Bapak Arif', dob: '2013-11-10', gender: 'Laki-laki', phone: '081298765432', className: 'Menengah A' },
  { id: 'S-003', name: 'Naila Putri', parent: 'Ibu Dina', dob: '2012-09-22', gender: 'Perempuan', phone: '081399988877', className: 'Lanjutan A' },
];

const DEFAULT_ATTENDANCE = [
  { id: 'A-001', studentId: 'S-001', studentName: 'Alya Rahma', date: '2026-10-01', status: 'Hadir' },
  { id: 'A-002', studentId: 'S-002', studentName: 'Farhan Rizki', date: '2026-10-01', status: 'Izin' },
  { id: 'A-003', studentId: 'S-003', studentName: 'Naila Putri', date: '2026-10-02', status: 'Sakit' },
];

const DEFAULT_ASSESSMENTS = [
  { id: 'N-001', studentId: 'S-001', studentName: 'Alya Rahma', level: "Dasar (Iqra')", bacaan: 85, hafalan: 82, tauhid: 88, fiqih: 80 },
  { id: 'N-002', studentId: 'S-002', studentName: 'Farhan Rizki', level: 'Menengah (Baca Al-Qur\'an)', bacaan: 78, hafalan: 87, tauhid: 80, fiqih: 82 },
  { id: 'N-003', studentId: 'S-003', studentName: 'Naila Putri', level: 'Lanjutan (Tahfidz 30 Juz)', bacaan: 90, hafalan: 94, tauhid: 88, fiqih: 86 },
];

const state = {
  user: null,
  activeSection: 'dashboard',
};

function createDefaultLogoDataUri() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#0f766e"/>
          <stop offset="100%" stop-color="#f4c86b"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="28" fill="#eafaf6"/>
      <circle cx="60" cy="60" r="42" fill="url(#g1)" opacity="0.15"/>
      <path d="M35 36c9-8 25-11 42-5 8 3 15 8 20 16-6-4-18-8-27-6-7 2-16 7-25 13-6 4-11 10-15 16 0-12 2-23 5-34z" fill="#0f766e"/>
      <path d="M41 82c6-16 18-27 32-31 6 5 10 11 11 20-8-2-17 3-25 8-7 5-14 12-18 18 0-5 0-10 0-15z" fill="#f4c86b"/>
      <path d="M58 40h18v44H58z" fill="#0f766e"/>
      <path d="M50 59h36v8H50z" fill="#0f766e"/>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function loadData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function bootstrap() {
  if (!localStorage.getItem(STORAGE_KEYS.profile)) saveData(STORAGE_KEYS.profile, DEFAULT_PROFILE);
  if (!localStorage.getItem(STORAGE_KEYS.users)) saveData(STORAGE_KEYS.users, DEFAULT_USERS);
  if (!localStorage.getItem(STORAGE_KEYS.students)) saveData(STORAGE_KEYS.students, DEFAULT_STUDENTS);
  if (!localStorage.getItem(STORAGE_KEYS.attendance)) saveData(STORAGE_KEYS.attendance, DEFAULT_ATTENDANCE);
  if (!localStorage.getItem(STORAGE_KEYS.organization)) saveData(STORAGE_KEYS.organization, DEFAULT_ORGANIZATION);
  if (!localStorage.getItem(STORAGE_KEYS.assessments)) saveData(STORAGE_KEYS.assessments, DEFAULT_ASSESSMENTS);

  bindEvents();
  renderLoginScreen();
  renderApp();
  renderCard();
}

function bindEvents() {
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  document.getElementById('profileForm').addEventListener('submit', saveProfileData);
  document.getElementById('accountForm').addEventListener('submit', addAccount);
  document.getElementById('studentForm').addEventListener('submit', addStudent);
  document.getElementById('attendanceForm').addEventListener('submit', addAttendance);
  document.getElementById('uktForm').addEventListener('submit', addAssessment);
  document.getElementById('generateCardBtn').addEventListener('click', renderCard);
  document.getElementById('downloadCardBtn').addEventListener('click', downloadCard);
  document.getElementById('profileLogoInput').addEventListener('change', handleLogoUpload);

  document.querySelectorAll('.nav-button').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeSection = button.dataset.section;
      switchSection(state.activeSection);
    });
  });

  document.querySelectorAll('[data-export]').forEach((button) => {
    button.addEventListener('click', () => exportPdf(button.dataset.export));
  });
}

function renderLoginScreen() {
  const profile = loadData(STORAGE_KEYS.profile, DEFAULT_PROFILE);
  const loginLogo = document.getElementById('loginLogo');
  const loginBrandName = document.getElementById('loginBrandName');
  const loginTagline = document.getElementById('loginTagline');
  const sidebarLogo = document.getElementById('sidebarLogo');
  const sidebarTitle = document.getElementById('sidebarTitle');
  const sidebarTagline = document.getElementById('sidebarTagline');

  loginLogo.src = profile.logo || DEFAULT_PROFILE.logo;
  loginBrandName.textContent = profile.name || 'TPA Ar-Rahman';
  loginTagline.textContent = profile.tagline || 'Tumbuhkan kecintaan pada Al-Qur\'an sejak dini.';

  sidebarLogo.src = profile.logo || DEFAULT_PROFILE.logo;
  sidebarTitle.textContent = profile.name || 'TPA Ar-Rahman';
  sidebarTagline.textContent = profile.tagline || 'Tagline';
}

function renderApp() {
  const visibleSections = {
    Admin: ['dashboard', 'profile', 'accounts', 'students', 'attendance', 'organization', 'card', 'ukt', 'pdf'],
    'Wali Santri': ['dashboard', 'profile', 'students', 'attendance', 'organization', 'card', 'ukt', 'pdf'],
  };

  if (!state.user) {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('appScreen').classList.add('hidden');
    return;
  }

  const allowed = visibleSections[state.user.role] || visibleSections['Wali Santri'];
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('appScreen').classList.remove('hidden');
  document.getElementById('userBadge').textContent = `Hai, ${state.user.name || state.user.id}`;

  document.querySelectorAll('.nav-button').forEach((button) => {
    const section = button.dataset.section;
    const active = allowed.includes(section);
    button.classList.toggle('hidden', !active);
    button.classList.toggle('is-active', section === state.activeSection && active);
  });

  switchSection(state.activeSection);
  renderDashboard();
  renderProfileForm();
  renderAccountTable();
  renderStudentTable();
  renderAttendanceTable();
  renderOrganizationLists();
  renderUktTable();
  renderReportPreview();
}

function switchSection(section) {
  document.querySelectorAll('.page-section').forEach((node) => node.classList.add('hidden'));
  const target = document.getElementById(`${section}Section`);
  if (target) target.classList.remove('hidden');

  document.getElementById('currentTitle').textContent = {
    dashboard: 'Dashboard',
    profile: 'Profil TPA',
    accounts: 'Pengaturan Akun',
    students: 'Pendaftaran Santri',
    attendance: 'Absensi',
    organization: 'Struktur Organisasi',
    card: 'Kartu Ucapan',
    ukt: 'Penilaian UKT',
    pdf: 'Ekspor PDF',
  }[section] || 'Dashboard';

  document.querySelectorAll('.nav-button').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.section === section);
  });
}

function handleLogin(event) {
  event.preventDefault();
  const id = document.getElementById('loginId').value.trim();
  const password = document.getElementById('loginPassword').value;
  const users = loadData(STORAGE_KEYS.users, DEFAULT_USERS);
  const user = users.find((entry) => entry.id === id && entry.password === password);

  if (!user) {
    showToast('ID atau password tidak valid. Hubungi admin untuk meminta akses.');
    return;
  }

  state.user = user;
  state.activeSection = 'dashboard';
  renderApp();
  document.getElementById('loginForm').reset();
}

function handleLogout() {
  state.user = null;
  state.activeSection = 'dashboard';
  renderApp();
  document.getElementById('loginForm').reset();
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2500);
}

function renderDashboard() {
  const students = loadData(STORAGE_KEYS.students, DEFAULT_STUDENTS);
  const attendance = loadData(STORAGE_KEYS.attendance, DEFAULT_ATTENDANCE);
  const assessments = loadData(STORAGE_KEYS.assessments, DEFAULT_ASSESSMENTS);
  const profile = loadData(STORAGE_KEYS.profile, DEFAULT_PROFILE);

  const presentCount = attendance.filter((item) => item.status === 'Hadir').length;
  const averageScore = assessments.length
    ? assessments.reduce((sum, item) => sum + calculateAverage(item), 0) / assessments.length
    : 0;
  const lulusCount = assessments.filter((item) => calculateAverage(item) >= 75).length;

  const summaryCards = [
    { label: 'Total Santri', value: students.length },
    { label: 'Hadir Hari Ini', value: presentCount },
    { label: 'Rata-rata Nilai', value: `${averageScore.toFixed(1)}` },
    { label: 'Santri Lulus', value: lulusCount },
  ];

  const summaryGrid = document.getElementById('summaryGrid');
  summaryGrid.innerHTML = summaryCards
    .map(
      (item) => `
        <div class="stat-card">
          <span class="stat-label">${item.label}</span>
          <div class="stat-value">${item.value}</div>
        </div>
      `
    )
    .join('');

  const quickActions = document.getElementById('quickActions');
  const actions = ['Pendaftaran', 'Absensi', 'UKT', 'PDF'];
  quickActions.innerHTML = actions
    .map(
      (action) => `
        <button type="button" class="quick-action" data-go="${action.toLowerCase()}">${action}</button>
      `
    )
    .join('');

  quickActions.querySelectorAll('[data-go]').forEach((button) => {
    button.addEventListener('click', () => {
      const map = { pendaftaran: 'students', absensi: 'attendance', ukt: 'ukt', pdf: 'pdf' };
      state.activeSection = map[button.dataset.go] || 'dashboard';
      switchSection(state.activeSection);
    });
  });

  const summaryBox = document.getElementById('profileSummaryBox');
  summaryBox.innerHTML = `
    <div class="summary-point"><strong>Nama TPA:</strong> ${profile.name}</div>
    <div class="summary-point"><strong>Alamat:</strong> ${profile.address}</div>
    <div class="summary-point"><strong>Tanggal Berdiri:</strong> ${formatDate(profile.founded)}</div>
    <div class="summary-point"><strong>Tagline:</strong> ${profile.tagline}</div>
    <div class="summary-point"><strong>Sejarah:</strong> ${profile.history}</div>
  `;

  const monthlyAttendanceBody = document.getElementById('monthlyAttendanceBody');
  monthlyAttendanceBody.innerHTML = buildMonthlyAttendanceRows(attendance);
}

function buildMonthlyAttendanceRows(attendanceList) {
  const grouped = attendanceList.reduce((acc, item) => {
    const monthKey = new Date(item.date).toLocaleString('id-ID', { month: 'long', year: 'numeric' });
    if (!acc[monthKey]) acc[monthKey] = { hadir: 0, izin: 0, sakit: 0, alpha: 0 };
    acc[monthKey][item.status.toLowerCase()] += 1;
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(
      ([month, values]) => `
        <tr>
          <td>${month}</td>
          <td>${values.hadir || 0}</td>
          <td>${values.izin || 0}</td>
          <td>${values.sakit || 0}</td>
          <td>${values.alpha || 0}</td>
        </tr>
      `
    )
    .join('');
}

function renderProfileForm() {
  const profile = loadData(STORAGE_KEYS.profile, DEFAULT_PROFILE);
  document.getElementById('profileName').value = profile.name;
  document.getElementById('profileAddress').value = profile.address;
  document.getElementById('profileFounded').value = profile.founded;
  document.getElementById('profileTagline').value = profile.tagline;
  document.getElementById('profileHistory').value = profile.history;
  document.getElementById('profileLogoPreview').src = profile.logo || DEFAULT_PROFILE.logo;
}

function saveProfileData(event) {
  event.preventDefault();
  const profile = {
    name: document.getElementById('profileName').value.trim(),
    address: document.getElementById('profileAddress').value.trim(),
    founded: document.getElementById('profileFounded').value,
    tagline: document.getElementById('profileTagline').value.trim(),
    history: document.getElementById('profileHistory').value.trim(),
    logo: document.getElementById('profileLogoPreview').src || DEFAULT_PROFILE.logo,
  };

  saveData(STORAGE_KEYS.profile, profile);
  renderLoginScreen();
  renderDashboard();
  showToast('Profil TPA berhasil diperbarui.');
}

function handleLogoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('profileLogoPreview').src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function renderAccountTable() {
  const users = loadData(STORAGE_KEYS.users, DEFAULT_USERS);
  const tbody = document.getElementById('accountTableBody');

  tbody.innerHTML = users
    .map(
      (user) => `
        <tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.role}</td>
          <td>
            ${user.id === 'admin' || user.id === 'wali_santri'
              ? '<span class="badge pass">Default</span>'
              : `<button type="button" class="secondary-button" data-remove-user="${user.id}">Hapus</button>`}
          </td>
        </tr>
      `
    )
    .join('');

  tbody.querySelectorAll('[data-remove-user]').forEach((button) => {
    button.addEventListener('click', () => {
      const userId = button.dataset.removeUser;
      const nextUsers = loadData(STORAGE_KEYS.users, DEFAULT_USERS).filter((entry) => entry.id !== userId);
      saveData(STORAGE_KEYS.users, nextUsers);
      renderAccountTable();
      showToast('Akun berhasil dihapus.');
    });
  });
}

function addAccount(event) {
  event.preventDefault();
  const username = document.getElementById('accountUsername').value.trim();
  const password = document.getElementById('accountPassword').value.trim();
  const name = document.getElementById('accountName').value.trim();
  const role = document.getElementById('accountRole').value;

  if (!username || !password || !name) {
    showToast('Semua field akun harus diisi.');
    return;
  }

  const users = loadData(STORAGE_KEYS.users, DEFAULT_USERS);
  if (users.some((entry) => entry.id === username)) {
    showToast('Username sudah digunakan.');
    return;
  }

  users.push({ id: username, password, role, name });
  saveData(STORAGE_KEYS.users, users);
  document.getElementById('accountForm').reset();
  renderAccountTable();
  showToast('Akun baru berhasil ditambahkan.');
}

function renderStudentTable() {
  const students = loadData(STORAGE_KEYS.students, DEFAULT_STUDENTS);
  const tbody = document.getElementById('studentTableBody');

  tbody.innerHTML = students
    .map(
      (student) => `
        <tr>
          <td>${student.name}</td>
          <td>${student.parent}</td>
          <td>${student.dob}</td>
          <td>${student.gender}</td>
          <td>${student.phone}</td>
          <td>${student.className}</td>
          <td><button class="secondary-button" data-delete-student="${student.id}">Hapus</button></td>
        </tr>
      `
    )
    .join('');

  tbody.querySelectorAll('[data-delete-student]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.deleteStudent;
      const nextStudents = loadData(STORAGE_KEYS.students, DEFAULT_STUDENTS).filter((student) => student.id !== id);

      saveData(STORAGE_KEYS.students, nextStudents);
      renderStudentTable();
      renderAttendanceTable();
      renderUktTable();
      renderReportPreview();
      renderDashboard();
      showToast('Data santri berhasil dihapus.');
    });
  });

  const studentOptions = students
    .map((student) => `<option value="${student.id}">${student.name}</option>`)
    .join('');

  document.getElementById('attendanceStudent').innerHTML = studentOptions;
  document.getElementById('uktStudent').innerHTML = studentOptions;
}

function addStudent(event) {
  event.preventDefault();
  const student = {
    id: `S-${String(Date.now()).slice(-5)}`,
    name: document.getElementById('studentName').value.trim(),
    parent: document.getElementById('studentParent').value.trim(),
    dob: document.getElementById('studentDob').value,
    gender: document.getElementById('studentGender').value,
    phone: document.getElementById('studentPhone').value.trim(),
    className: document.getElementById('studentClass').value.trim(),
  };

  if (!student.name || !student.parent || !student.dob || !student.phone || !student.className) {
    showToast('Data santri belum lengkap.');
    return;
  }

  const students = loadData(STORAGE_KEYS.students, DEFAULT_STUDENTS);
  students.push(student);
  saveData(STORAGE_KEYS.students, students);
  document.getElementById('studentForm').reset();
  renderStudentTable();
  renderDashboard();
  renderReportPreview();
  showToast('Data santri berhasil ditambahkan.');
}

function renderAttendanceTable() {
  const attendance = loadData(STORAGE_KEYS.attendance, DEFAULT_ATTENDANCE);
  const tbody = document.getElementById('attendanceTableBody');

  tbody.innerHTML = attendance
    .map(
      (record) => `
        <tr>
          <td>${record.studentName}</td>
          <td>${record.date}</td>
          <td><span class="badge ${record.status === 'Hadir' ? 'pass' : 'fail'}">${record.status}</span></td>
          <td><button class="secondary-button" data-delete-attendance="${record.id}">Hapus</button></td>
        </tr>
      `
    )
    .join('');

  tbody.querySelectorAll('[data-delete-attendance]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.deleteAttendance;
      const filtered = loadData(STORAGE_KEYS.attendance, DEFAULT_ATTENDANCE).filter((item) => item.id !== id);
      saveData(STORAGE_KEYS.attendance, filtered);
      renderAttendanceTable();
      renderDashboard();
      showToast('Absensi berhasil dihapus.');
    });
  });

  const attendanceDate = document.getElementById('attendanceDate');
  if (!attendanceDate.value) attendanceDate.value = new Date().toISOString().slice(0, 10);
}

function addAttendance(event) {
  event.preventDefault();
  const students = loadData(STORAGE_KEYS.students, DEFAULT_STUDENTS);
  const studentId = document.getElementById('attendanceStudent').value;
  const student = students.find((entry) => entry.id === studentId);
  const date = document.getElementById('attendanceDate').value;
  const status = document.getElementById('attendanceStatus').value;

  if (!student || !date) {
    showToast('Pilih santri dan tanggal absensi.');
    return;
  }

  const records = loadData(STORAGE_KEYS.attendance, DEFAULT_ATTENDANCE);
  records.push({
    id: `A-${String(Date.now()).slice(-5)}`,
    studentId: student.id,
    studentName: student.name,
    date,
    status,
  });

  saveData(STORAGE_KEYS.attendance, records);
  event.target.reset();
  document.getElementById('attendanceDate').value = new Date().toISOString().slice(0, 10);
  renderAttendanceTable();
  renderDashboard();
  showToast('Absensi berhasil disimpan.');
}

function renderOrganizationLists() {
  const organization = loadData(STORAGE_KEYS.organization, DEFAULT_ORGANIZATION);
  document.getElementById('teacherList').innerHTML = organization.teachers
    .map(
      (person) => `
        <div class="list-item">
          <strong>${person.name}</strong>
          <span>${person.role}</span>
        </div>
      `
    )
    .join('');

  document.getElementById('boardList').innerHTML = organization.board
    .map(
      (person) => `
        <div class="list-item">
          <strong>${person.name}</strong>
          <span>${person.role}</span>
        </div>
      `
    )
    .join('');
}

function renderCard() {
  const canvas = document.getElementById('cardCanvas');
  const ctx = canvas.getContext('2d');

  const name = document.getElementById('cardName').value || 'Santri TPA';
  const title = document.getElementById('cardTitle').value || 'Selamat Belajar';
  const message = document.getElementById('cardMessage').value || 'Semoga ilmu yang dipelajari bermanfaat.';
  const color = document.getElementById('cardColor').value || '#0f766e';

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#f7faf5');
  gradient.addColorStop(1, '#eefaf4');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, 140);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 28px Inter';
  ctx.fillText('TPA Ar-Rahman', 48, 72);

  ctx.fillStyle = '#1b2430';
  ctx.font = '700 42px Inter';
  ctx.fillText(title, 48, 220);

  ctx.font = '500 26px Inter';
  wrapText(ctx, `Kepada: ${name}`, 48, 280, 620, 36);

  ctx.font = '500 22px Inter';
  wrapText(ctx, message, 48, 332, 620, 32);

  const logo = new Image();
  logo.src = loadData(STORAGE_KEYS.profile, DEFAULT_PROFILE).logo || DEFAULT_PROFILE.logo;
  logo.onload = () => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width - 120, 106, 52, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(logo, canvas.width - 172, 54, 104, 104);
    ctx.restore();
  };
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let i = 0; i < words.length; i += 1) {
    const testLine = `${line}${words[i]} `;
    const metrics = context.measureText(testLine);

    if (metrics.width > maxWidth && i > 0) {
      context.fillText(line.trim(), x, currentY);
      line = `${words[i]} `;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  context.fillText(line.trim(), x, currentY);
}

function downloadCard() {
  const canvas = document.getElementById('cardCanvas');
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'kartu-ucapan-tpa-ar-rahman.png';
  link.click();
}

function renderUktTable() {
  const assessments = loadData(STORAGE_KEYS.assessments, DEFAULT_ASSESSMENTS);
  const tbody = document.getElementById('uktTableBody');

  tbody.innerHTML = assessments
    .map((entry) => {
      const average = calculateAverage(entry);
      const status = average >= 75 ? 'Lulus' : 'Remedial';
      return `
        <tr>
          <td>${entry.studentName}</td>
          <td>${entry.level}</td>
          <td>${entry.bacaan}</td>
          <td>${entry.hafalan}</td>
          <td>${entry.tauhid}</td>
          <td>${entry.fiqih}</td>
          <td>${average.toFixed(1)}</td>
          <td><span class="badge ${status === 'Lulus' ? 'pass' : 'fail'}">${status}</span></td>
        </tr>
      `;
    })
    .join('');

  const students = loadData(STORAGE_KEYS.students, DEFAULT_STUDENTS);
  document.getElementById('uktStudent').innerHTML = students
    .map((student) => `<option value="${student.id}">${student.name}</option>`)
    .join('');
}

function addAssessment(event) {
  event.preventDefault();
  const students = loadData(STORAGE_KEYS.students, DEFAULT_STUDENTS);
  const studentId = document.getElementById('uktStudent').value;
  const student = students.find((entry) => entry.id === studentId);

  if (!student) {
    showToast('Pilih santri terlebih dahulu.');
    return;
  }

  const assessment = {
    id: `N-${String(Date.now()).slice(-5)}`,
    studentId: student.id,
    studentName: student.name,
    level: document.getElementById('uktLevel').value,
    bacaan: Number(document.getElementById('uktBacaan').value),
    hafalan: Number(document.getElementById('uktHafalan').value),
    tauhid: Number(document.getElementById('uktTauhid').value),
    fiqih: Number(document.getElementById('uktFiqih').value),
  };

  const data = loadData(STORAGE_KEYS.assessments, DEFAULT_ASSESSMENTS);
  const index = data.findIndex((entry) => entry.studentId === student.id);
  if (index >= 0) data[index] = assessment;
  else data.push(assessment);

  saveData(STORAGE_KEYS.assessments, data);
  renderUktTable();
  renderReportPreview();
  renderDashboard();
  showToast('Nilai UKT berhasil disimpan.');
}

function calculateAverage(entry) {
  const values = [entry.bacaan, entry.hafalan, entry.tauhid, entry.fiqih];
  const total = values.reduce((sum, value) => sum + Number(value || 0), 0);
  return total / values.length;
}

function renderReportPreview() {
  const students = loadData(STORAGE_KEYS.students, DEFAULT_STUDENTS);
  const assessments = loadData(STORAGE_KEYS.assessments, DEFAULT_ASSESSMENTS);
  const profile = loadData(STORAGE_KEYS.profile, DEFAULT_PROFILE);
  const preview = document.getElementById('reportPreview');

  if (!students.length) {
    preview.innerHTML = '<div class="report-card">Belum ada data santri.</div>';
    return;
  }

  preview.innerHTML = students
    .map((student) => {
      const assessment = assessments.find((entry) => entry.studentId === student.id);
      const average = assessment ? calculateAverage(assessment) : 0;
      const status = average >= 75 ? 'Lulus' : 'Belum Lulus';

      return `
        <div class="report-card">
          <h3>${profile.name}</h3>
          <p><strong>Nama:</strong> ${student.name}</p>
          <p><strong>Kelas:</strong> ${student.className}</p>
          <p><strong>Nilai Rata-rata:</strong> ${average.toFixed(1)}</p>
          <p><strong>Status:</strong> ${status}</p>
        </div>
      `;
    })
    .join('');
}

function exportPdf(type) {
  if (!window.jspdf) {
    showToast('Fitur PDF tidak tersedia di browser ini.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4');
  const profile = loadData(STORAGE_KEYS.profile, DEFAULT_PROFILE);
  const students = loadData(STORAGE_KEYS.students, DEFAULT_STUDENTS);
  const attendance = loadData(STORAGE_KEYS.attendance, DEFAULT_ATTENDANCE);
  const assessments = loadData(STORAGE_KEYS.assessments, DEFAULT_ASSESSMENTS);

  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(profile.name || 'TPA Ar-Rahman', 14, 18);
  doc.setFontSize(10);
  doc.text('Sistem Manajemen TPA Ar-Rahman', 14, 24);

  let y = 42;
  doc.setTextColor(20, 20, 20);

  if (type === 'studentsPdf') {
    doc.setFontSize(14);
    doc.text('Data Santri', 14, y);
    y += 10;

    students.forEach((student, index) => {
      if (index > 0 && y > 250) {
        doc.addPage();
        y = 22;
      }
      doc.setFontSize(10);
      doc.text(`${index + 1}. ${student.name} | Wali: ${student.parent} | Kelas: ${student.className} | TTL: ${student.dob} | HP: ${student.phone}`, 14, y);
      y += 8;
    });
  }

  if (type === 'attendancePdf') {
    doc.setFontSize(14);
    doc.text('Absensi Santri', 14, y);
    y += 10;

    attendance.forEach((entry, index) => {
      if (index > 0 && y > 250) {
        doc.addPage();
        y = 22;
      }
      doc.setFontSize(10);
      doc.text(`${index + 1}. ${entry.studentName} | ${entry.date} | ${entry.status}`, 14, y);
      y += 8;
    });
  }

  if (type === 'uktPdf') {
    doc.setFontSize(14);
    doc.text('Leger Nilai UKT', 14, y);
    y += 10;

    assessments.forEach((entry, index) => {
      if (index > 0 && y > 250) {
        doc.addPage();
        y = 22;
      }
      const avg = calculateAverage(entry).toFixed(1);
      doc.setFontSize(10);
      doc.text(`${index + 1}. ${entry.studentName} | ${entry.level} | Rata-rata: ${avg} | Status: ${avg >= 75 ? 'Lulus' : 'Remedial'}`, 14, y);
      y += 8;
    });
  }

  if (type === 'reportPdf') {
    doc.setFontSize(14);
    doc.text('Rapor Santri', 14, y);
    y += 10;

    students.forEach((student, index) => {
      const assessment = assessments.find((entry) => entry.studentId === student.id);
      const avg = assessment ? calculateAverage(assessment).toFixed(1) : '0.0';
      const status = assessment && calculateAverage(assessment) >= 75 ? 'Lulus' : 'Belum Lulus';
      if (index > 0 && y > 240) {
        doc.addPage();
        y = 22;
      }
      doc.setFontSize(10);
      doc.text(`${index + 1}. ${student.name} | Kelas: ${student.className} | Nilai Rata-rata: ${avg} | Status: ${status}`, 14, y);
      y += 9;
    });
  }

  const fileMap = {
    studentsPdf: 'data-santri.pdf',
    attendancePdf: 'absensi-santri.pdf',
    uktPdf: 'leger-nilai-ukt.pdf',
    reportPdf: 'rapor-santri.pdf',
  };

  doc.save(fileMap[type] || 'dokumen-tpa.pdf');
  showToast('PDF berhasil dibuat.');
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

bootstrap();













































































































































































































