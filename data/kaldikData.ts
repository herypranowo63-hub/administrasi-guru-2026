export interface KaldikEvent {
  no: number;
  date: string;
  description: string;
}

export interface EffectiveDayRow {
  month: string;
  year: number;
  effectiveDays: number;
  firstDay?: number;
  assessment?: number;
  ceremony?: number;
  reportCard?: number;
  semesterBreak?: number;
  sunday?: number;
  publicHoliday?: number;
  religiousHoliday?: number;
  totalHoliday?: number;
}

export const KALDIK_EVENTS: KaldikEvent[] = [
  { no: 1, date: "14 Juli 2025 - 20 Desember 2025", description: "Hari efektif sekolah semester gasal Tahun Ajaran 2025/2026 (114 hari)" },
  { no: 2, date: "14 Juli 2025", description: "Hari-hari Pertama Masuk Sekolah" },
  { no: 3, date: "14 - 18 Juli 2025", description: "Kegiatan MPLS (Masa Pengenalan Lingkungan Satuan Pendidikan)" },
  { no: 4, date: "19 Juli 2025", description: "Masa Pengenalan Mitra Sekolah" },
  { no: 5, date: "19 - 20 Juli 2025", description: "Kegiatan Pramuka Persami" },
  { no: 6, date: "15-16 Agustus 2025", description: "Kegiatan Kesiswaan Lomba dalam rangka perayaan Hari Kemerdekaan RI" },
  { no: 7, date: "17 Agustus 2025", description: "Mengikuti Upacara HUT Kemerdekaan RI" },
  { no: 8, date: "25-28 Agustus 2025", description: "Pelaksanaan Asesmen Nasional" },
  { no: 9, date: "05 September 2025", description: "Libur Umum ( Peringatan Maulid Nabi Muhammad SAW 1447 H)" },
  { no: 10, date: "22-27 September 2025", description: "Kegiatan Tengah Semester Gasal (Porseni, Karya Wisata, dll) / Asesmen Sumatif Tengah Semester" },
  { no: 11, date: "25 September 2025 - 10 Oktober 2025", description: "Pelaksanaan survei lingkungan belajar bagi kepala sekolah dan pendidik" },
  { no: 12, date: "01 Oktober 2025", description: "Mengikuti hari Kesaktian Pancasila" },
  { no: 13, date: "28 Oktober 2025", description: "Mengikuti Upacara Peringatan Hari Sumpah Pemuda" },
  { no: 14, date: "6-8 November 2025", description: "Latihan Dasar Kepemimpinan OSIS" },
  { no: 15, date: "10 November 2025", description: "Mengikuti Upacara Peringatan Hari Pahlawan" },
  { no: 16, date: "17 November 2025", description: "Pelantikan Pengurus OSIS" },
  { no: 17, date: "1-6 Desember 2025", description: "Pelaksanaan Asesmen Sumatif Akhir Semester Gasal" },
  { no: 18, date: "8-19 Desember 2025", description: "Kegiatan Akhir Semester Gasal / Kegiatan Kesiswaan" },
  { no: 19, date: "20 Desember 2025", description: "Penyerahan Buku Laporan Hasil Belajar Semester gasal" },
  { no: 20, date: "22 Desember 2025 - 3 Januari 2026", description: "Libur Akhir Semester Gasal" },
  { no: 21, date: "25 Desember 2025", description: "Libur Umum (Hari Raya Natal)" },
  { no: 22, date: "26 Desember 2025", description: "Cuti Bersama Setelah Hari Raya Natal" },
  { no: 23, date: "01 Januari 2026", description: "Libur Umum ( Tahun Baru Masehi 2026)" },
  { no: 24, date: "5 Januari 2026 - 21 Juni 2026", description: "Hari Efektif Sekolah Semester Genap (128 hari)" },
  { no: 25, date: "05 Januari 2026", description: "Hari Pertama Masuk Semester Genap" },
  { no: 26, date: "16 Januari 2026", description: "Libur Umum ( Isro' Mi ' raj 1447 H)" },
  { no: 27, date: "17 Februari 2026", description: "Libur Umum ( Tahun Baru Imlek 2577)" },
  { no: 28, date: "19 Februari 2026", description: "Perkiraan Libur Awal Puasa Ramadhan 1447 H" },
  { no: 29, date: "21 Februari 2026", description: "Peringatan Hari Peduli Sampah Nasional" },
  { no: 30, date: "2-7 Maret 2026", description: "Kegiatan Tengah Semester Genap / Asesmen Sumatif Tengah Semester Genap" },
  { no: 31, date: "12-14 Maret 2026", description: "Kegiatan Pesantren Kilat" },
  { no: 32, date: "16-18 Maret 2026", description: "Libur menjelang Hari Raya Idul Fitri 1447 H" },
  { no: 33, date: "18 Maret 2026", description: "Peringatan Hari Ulang Tahun SMP N 1 Kaligondang" },
  { no: 34, date: "19 Maret 2026", description: "Libur Umum ( Hari Raya Nyepi 1948 Saka )" },
  { no: 35, date: "20-21 Maret 2026", description: "Libur Hari Raya Idul Fitri 1447 H" },
  { no: 36, date: "22 Maret 2026", description: "Peringatan Hari Air Sedunia" },
  { no: 37, date: "23-28 Maret 2026", description: "Cuti bersama Hari Raya Idul Fitri 1447 H" },
  { no: 38, date: "30 Maret - 11 April 2026", description: "Asesmen Sumatif Akhir Jenjang Tahun Ajaran 2025/2026" },
  { no: 39, date: "03 April 2026", description: "Libur Umum (Wafat Yesus Kristus)" },
  { no: 40, date: "13-15 April 2026", description: "Perkiraan Tes Kemampuan Akademik (TKA)" },
  { no: 41, date: "21 April 2026", description: "Peringatan Hari Kartini" },
  { no: 42, date: "22 April 2026", description: "Peringatan Hari Bumi" },
  { no: 43, date: "01 Mei 2026", description: "Libur Umum ( Hari Buruh Internasional)" },
  { no: 44, date: "02 Mei 2026", description: "Peringatan Hari Pendidikan Nasional" },
  { no: 45, date: "14 Mei 2026", description: "Libur Umum (Hari Raya Kenaikan Yesus Kristus )" },
  { no: 46, date: "20 Mei 2026", description: "Peringatan Hari Kebangkitan Nasional" },
  { no: 47, date: "25 Mei - 6 Juni 2026", description: "Pelaksanaan Asesmen Sumatif Akhir Semester Genap" },
  { no: 48, date: "27 Mei 2026", description: "Libur Umum (Hari Raya Idul Adha 1447 H)" },
  { no: 49, date: "31 Mei 2026", description: "Libur Umum (Hari Raya Waisak 2570 BE)" },
  { no: 50, date: "01 Juni 2026", description: "Libur Umum (Peringatan Hari Lahir Pancasila)" },
  { no: 51, date: "02 Juni 2026", description: "Perkiraan Pengumuman Kelulusan" },
  { no: 52, date: "05 Juni 2026", description: "Peringatan Hari Lingkungan Hidup Sedunia" },
  { no: 53, date: "17 Juni 2026", description: "Libur Umum (Tahun Baru Islam 1448 H)" },
  { no: 54, date: "20 Juni 2026", description: "Penyerahan Buku Laporan Hasil Belajar Semester Genap" },
  { no: 55, date: "22 Juni 2025 - 11 Juli 2026", description: "Libur Akhir Semester Genap Tahun Ajaran 2025/2026" },
  { no: 56, date: "23-28 Juni 2026", description: "Perkiraan Penerimaan Peserta Didik Baru" },
  { no: 57, date: "13 Juli 2026", description: "Permulaan Tahun Pelajaran 2026/2027" },
];

export const EFFECTIVE_DAYS_GASAL: EffectiveDayRow[] = [
  { month: "JULI", year: 2025, effectiveDays: 16, firstDay: 5, sunday: 2, totalHoliday: 18 },
  { month: "AGUSTUS", year: 2025, effectiveDays: 26, assessment: 4, ceremony: 1, sunday: 5, totalHoliday: 31 },
  { month: "SEPTEMBER", year: 2025, effectiveDays: 25, sunday: 4, publicHoliday: 1, totalHoliday: 30 },
  { month: "OKTOBER", year: 2025, effectiveDays: 27, ceremony: 2, sunday: 4, totalHoliday: 31 },
  { month: "NOVEMBER", year: 2025, effectiveDays: 25, ceremony: 1, sunday: 5, totalHoliday: 30 },
  { month: "DESEMBER", year: 2025, effectiveDays: 18, reportCard: 1, semesterBreak: 7, sunday: 4, publicHoliday: 2, totalHoliday: 31 },
];

export const EFFECTIVE_DAYS_GENAP: EffectiveDayRow[] = [
  { month: "JANUARI", year: 2026, effectiveDays: 23, semesterBreak: 2, sunday: 4, publicHoliday: 2, totalHoliday: 31 },
  { month: "FEBRUARI", year: 2026, effectiveDays: 22, sunday: 4, publicHoliday: 1, religiousHoliday: 1, totalHoliday: 28 },
  { month: "MARET", year: 2026, effectiveDays: 14, sunday: 5, publicHoliday: 3, religiousHoliday: 9, totalHoliday: 31 },
  { month: "APRIL", year: 2026, effectiveDays: 25, sunday: 4, publicHoliday: 1, totalHoliday: 30 },
  { month: "MEI", year: 2026, effectiveDays: 23, ceremony: 2, sunday: 4, publicHoliday: 4, totalHoliday: 31 },
  { month: "JUNI", year: 2026, effectiveDays: 16, ceremony: 1, semesterBreak: 8, sunday: 4, publicHoliday: 2, totalHoliday: 30 },
  { month: "JULI", year: 2026, effectiveDays: 0, reportCard: 1, semesterBreak: 10, sunday: 2, totalHoliday: 12 },
];
