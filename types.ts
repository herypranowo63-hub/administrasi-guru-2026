
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
