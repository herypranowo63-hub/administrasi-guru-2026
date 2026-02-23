
export type Role = 'ADMIN' | 'TEACHER' | 'WALAS';

export enum Gender {
  MALE = 'Laki-laki',
  FEMALE = 'Perempuan'
}

export enum AttendanceStatus {
  HADIR = 'H',
  SAKIT = 'S',
  IZIN = 'I',
  ALPA = 'A'
}

export enum ExecutionStatus {
  LEBIH = '+',
  KURANG = '-',
  SESUAI = '0'
}

export interface Student {
  id: string;
  name: string;
  gender: Gender;
  classId: string;
}

export interface TeacherBio {
  name: string;
  nip: string;
  pangkat: string;
  golongan: string;
  jabatan: string;
  subjects: string[];
  classes: string[];
}

export interface WalasBio {
  classId: string;
  name: string;
  nip: string;
  pangkat: string;
  golongan: string;
  jabatan: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
}

export interface TeacherAttendance {
  id: string;
  teacherId: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
  classId: string;
}

export interface Schedule {
  id: string;
  teacherId: string;
  day: string;
  period: number; // 1-8
  subject: string;
}

export interface DailyPlan {
  id: string;
  date: string;
  period: string;
  classId: string;
  subject: string;
  material: string;
  execution: ExecutionStatus;
  notes: string;
  type: 'TEACHER' | 'WALAS' | 'BK';
}

export interface TeacherJournal {
  id: string;
  date: string;
  period: string;
  classId: string;
  subject: string;
  activities: {
    start: string;
    core: string;
    end: string;
    reflection: string;
    followUp: string;
  };
  attendance: string;
  notes: string;
  type: 'TEACHER' | 'WALAS' | 'BK';
  teacherName?: string; // Added to track who owns the journal
}

export interface Prota {
  id: string;
  teacherId: string;
  subject: string;
  grade: string; // 7, 8, 9
  semester: '1' | '2';
  topic: string; // Materi Pokok / CP
  allocation: number; // JP
}

export interface Promes {
  id: string;
  teacherId: string;
  subject: string;
  grade: string;
  semester: '1' | '2';
  topic: string;
  allocation: number;
  // Distribution: key is "monthIndex-weekIndex" (e.g., "6-1" for July Week 1), value is JP amount
  distribution: Record<string, number>; 
}

export interface TP {
  id: string;
  teacherId: string;
  subject: string;
  grade: string;
  code: string; // e.g. "7.1"
  element: string; // e.g. "Bilangan"
  description: string;
}

export interface ATP {
  id: string;
  teacherId: string;
  subject: string;
  grade: string;
  semester: '1' | '2';
  tpId: string; // Reference to TP
  order: number;
  allocation: number; // JP
  notes?: string;
}

export interface TeachingModule {
  id: string;
  teacherId: string;
  subject: string;
  grade: string;
  semester: '1' | '2';
  topic: string;
  fileName: string;
  fileSize: number;
  fileData: string; // Base64 string
  uploadDate: string;
  meeting?: string; // Pertemuan ke-
  allocation?: number; // JP
}

export interface KKTP {
  id: string;
  teacherId: string;
  subject: string;
  grade: string;
  semester: '1' | '2';
  tpCode: string;
  tpDescription: string;
  criteria: string; // Kriteria / Indikator Tuntas
  interval1: string; // 0 - 40%
  interval2: string; // 41 - 65%
  interval3: string; // 66 - 85%
  interval4: string; // 86 - 100%
  range1Label?: string; // e.g. "0 - 40%"
  range2Label?: string; // e.g. "41 - 65%"
  range3Label?: string; // e.g. "66 - 85%"
  range4Label?: string; // e.g. "86 - 100%"
}
