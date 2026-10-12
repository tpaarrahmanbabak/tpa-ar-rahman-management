import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');

fs.mkdirSync(dataDir, { recursive: true });

export const db = new sqlite3.Database(path.join(dataDir, 'tpa.db'));

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export async function initializeDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK(id = 1),
      name TEXT,
      address TEXT,
      founded TEXT,
      tagline TEXT,
      history TEXT,
      logo TEXT
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      name TEXT,
      role TEXT
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT,
      parent TEXT,
      dob TEXT,
      gender TEXT,
      phone TEXT,
      className TEXT
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY,
      studentId TEXT,
      studentName TEXT,
      date TEXT,
      status TEXT
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS assessments (
      id TEXT PRIMARY KEY,
      studentId TEXT,
      studentName TEXT,
      level TEXT,
      bacaan INTEGER,
      hafalan INTEGER,
      tauhid INTEGER,
      fiqih INTEGER
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS organization (
      id INTEGER PRIMARY KEY CHECK(id = 1),
      teachers TEXT,
      board TEXT
    )
  `);

  const profileRow = await get('SELECT * FROM profile WHERE id = 1');
  if (!profileRow) {
    await run(
      `INSERT INTO profile (id, name, address, founded, tagline, history, logo)
       VALUES (1, ?, ?, ?, ?, ?, ?)`,
      [
        'TPA Ar-Rahman',
        'Jl. Pendidikan Islam No. 1, Kota Bandung',
        '2015-01-15',
        'Tumbuhkan kecintaan pada Al-Qur\'an sejak dini.',
        'TPA Ar-Rahman didirikan untuk menumbuhkan semangat membaca dan menghafal Al-Qur\'an serta membangun akhlak islami sejak dini.',
        createDefaultLogoBase64(),
      ]
    );
  }

  const userCount = await get('SELECT COUNT(*) AS count FROM users');
  if (!userCount || Number(userCount.count) === 0) {
    await run(
      `INSERT INTO users (username, password, name, role) VALUES
       (?, ?, ?, ?),
       (?, ?, ?, ?)
      `,
      ['admin', 'Kevinganteng313', 'Administrator', 'Admin', 'wali_santri', 'walisantri123', 'Wali Santri', 'Wali Santri']
    );
  }

  const studentCount = await get('SELECT COUNT(*) AS count FROM students');
  if (!studentCount || Number(studentCount.count) === 0) {
    const defaults = [
      ['S-001', 'Alya Rahma', 'Ibu Siti', '2014-05-01', 'Perempuan', '081234567890', 'Dasar A'],
      ['S-002', 'Farhan Rizki', 'Bapak Arif', '2013-11-10', 'Laki-laki', '081298765432', 'Menengah A'],
      ['S-003', 'Naila Putri', 'Ibu Dina', '2012-09-22', 'Perempuan', '081399988877', 'Lanjutan A']
    ];

    for (const student of defaults) {
      await run(
        `INSERT INTO students (id, name, parent, dob, gender, phone, className)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        student
      );
    }
  }

  const attendanceCount = await get('SELECT COUNT(*) AS count FROM attendance');
  if (!attendanceCount || Number(attendanceCount.count) === 0) {
    await run(
      `INSERT INTO attendance (id, studentId, studentName, date, status) VALUES
       (?, ?, ?, ?, ?),
       (?, ?, ?, ?, ?),
       (?, ?, ?, ?, ?)
      `,
      [
        'A-001', 'S-001', 'Alya Rahma', '2026-10-01', 'Hadir',
        'A-002', 'S-002', 'Farhan Rizki', '2026-10-01', 'Izin',
        'A-003', 'S-003', 'Naila Putri', '2026-10-02', 'Sakit'
      ]
    );
  }

  const assessmentCount = await get('SELECT COUNT(*) AS count FROM assessments');
  if (!assessmentCount || Number(assessmentCount.count) === 0) {
    await run(
      `INSERT INTO assessments (id, studentId, studentName, level, bacaan, hafalan, tauhid, fiqih) VALUES
       (?, ?, ?, ?, ?, ?, ?, ?),
       (?, ?, ?, ?, ?, ?, ?, ?),
       (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        'N-001', 'S-001', 'Alya Rahma', "Dasar (Iqra')", 85, 82, 88, 80,
        'N-002', 'S-002', 'Farhan Rizki', 'Menengah (Baca Al-Qur\'an)', 78, 87, 80, 82,
        'N-003', 'S-003', 'Naila Putri', 'Lanjutan (Tahfidz 30 Juz)', 90, 94, 88, 86
      ]
    );
  }

  const organizationRow = await get('SELECT * FROM organization WHERE id = 1');
  if (!organizationRow) {
    await run(
      `INSERT INTO organization (id, teachers, board) VALUES (1, ?, ?)`,
      [
        JSON.stringify([
          { name: 'Ustadzah Siti Aisyah', role: 'Koordinator Dasar' },
          { name: 'Ustadz Rafi Hidayat', role: 'Guru Tahfidz' },
          { name: 'Ustadzah Nabila', role: 'Guru Fiqih' }
        ]),
        JSON.stringify([
          { name: 'Dewi Asih', role: 'Ketua Yayasan' },
          { name: 'Arif Suhaemi', role: 'Sekretaris Umum' },
          { name: 'Maman Hamdani', role: 'Bendahara' }
        ])
      ]
    );
  }
}

export function createDefaultLogoBase64() {
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

export { run, get, all };
