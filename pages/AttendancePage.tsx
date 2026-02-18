
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserX
} from 'lucide-react';
import { AttendanceStatus, Student, Gender } from '../types';
import { CLASSES } from '../constants';
import CalendarWidget from '../components/CalendarWidget';

const AttendancePage: React.FC<{ role: string }> = ({ role }) => {
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [attendanceType, setAttendanceType] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('spensa_students');
    if (saved) {
      setStudents(JSON.parse(saved));
    }
  }, []);

  const classStudents = students.filter(s => s.classId === selectedClass);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const getSemesterLabel = () => {
    if (currentYear === 2025) {
      return currentMonth >= 6 ? 'Semester Gasal 2025/2026' : 'Semester Genap 2024/2025';
    } else {
      return currentMonth <= 5 ? 'Semester Genap 2025/2026' : 'Semester Gasal 2026/2027';
    }
  };

  const statusColors = {
    [AttendanceStatus.HADIR]: 'bg-emerald-500 text-white',
    [AttendanceStatus.SAKIT]: 'bg-blue-500 text-white',
    [AttendanceStatus.IZIN]: 'bg-amber-500 text-white',
    [AttendanceStatus.ALPA]: 'bg-rose-500 text-white',
  };

  const statusLabels = {
    [AttendanceStatus.HADIR]: 'Hadir',
    [AttendanceStatus.SAKIT]: 'Sakit',
    [AttendanceStatus.IZIN]: 'Izin',
    [AttendanceStatus.ALPA]: 'Alpa',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sistem Presensi</h1>
          <p className="text-slate-500 font-medium">{getSemesterLabel()}</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          <button 
            onClick={() => setAttendanceType('STUDENT')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${attendanceType === 'STUDENT' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500'}`}
          >
            Presensi Siswa
          </button>
          <button 
            onClick={() => setAttendanceType('TEACHER')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${attendanceType === 'TEACHER' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500'}`}
          >
            Presensi Guru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Pengaturan</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Pilih Kelas</label>
                <select 
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                >
                  {CLASSES.map(c => <option key={c} value={c}>Kelas {c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <CalendarWidget />

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Rekapitulasi</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Hadir</span>
                <span className="text-sm font-black text-emerald-500">0</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[0%]"></div>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-xs font-bold italic">Belum ada input</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Input Presensi {attendanceType === 'STUDENT' ? `Kelas ${selectedClass}` : 'Harian Guru'}</h2>
                <p className="text-sm font-medium text-slate-500">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.values(AttendanceStatus).map(status => (
                  <div key={status} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl">
                    <div className={`w-3 h-3 rounded-full ${statusColors[status]}`}></div>
                    <span className="text-[10px] font-bold text-slate-500">{statusLabels[status]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto min-h-[300px]">
              {classStudents.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">No</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Nama Lengkap</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {classStudents.map((s, i) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="px-6 py-4 text-sm font-bold text-slate-400">{i + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${s.gender === Gender.MALE ? 'bg-blue-500' : 'bg-rose-500'}`}>
                              {s.name.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-slate-800">{s.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {Object.values(AttendanceStatus).map(status => (
                              <button key={status} className="w-10 h-10 rounded-xl flex items-center justify-center font-black bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                                {status}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <input type="text" placeholder="Catatan..." className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-medium w-40 focus:ring-2 focus:ring-blue-500" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                    <UserX size={40} className="text-slate-200" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-400">Belum ada siswa di kelas {selectedClass}.</p>
                    <p className="text-xs text-slate-400">Gunakan menu 'Data Siswa' untuk menginputkan murid.</p>
                  </div>
                </div>
              )}
            </div>
            
            {classStudents.length > 0 && (
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all">
                  Simpan Presensi Hari Ini
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AttendancePage;
