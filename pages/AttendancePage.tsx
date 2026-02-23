import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserX,
  Save,
  CheckCircle2,
  Download,
  Upload
} from 'lucide-react';
import { AttendanceStatus, Student, Gender } from '../types';
import { CLASSES, SCHOOL_LOGO } from '../constants';
import CalendarWidget from '../components/CalendarWidget';
import { exportToExcel, importFromExcel } from '../utils/excelUtils';

const AttendancePage: React.FC<{ role: string }> = ({ role }) => {
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [attendanceType, setAttendanceType] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [students, setStudents] = useState<Student[]>([]);
  
  // State to track attendance inputs: Record<StudentId, {status, note}>
  const [attendanceData, setAttendanceData] = useState<Record<string, { status: AttendanceStatus, note: string }>>({});
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedStudents = localStorage.getItem('spensa_students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, []);

  // Load existing attendance for selected class and today's date
  useEffect(() => {
    const allAttendance = JSON.parse(localStorage.getItem('spensa_attendance') || '[]');
    const today = new Date().toISOString().split('T')[0];
    
    // Filter records for today and selected class
    const currentClassRecords = allAttendance.filter((r: any) => r.date === today && r.classId === selectedClass);
    
    const map: Record<string, { status: AttendanceStatus, note: string }> = {};
    if (currentClassRecords.length > 0) {
      currentClassRecords.forEach((r: any) => {
        map[r.studentId] = { status: r.status, note: r.note || '' };
      });
      setAttendanceData(map);
    } else {
      // Reset if no data found for today
      setAttendanceData({});
    }
    setIsSaved(false);
  }, [selectedClass]);

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

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
    setIsSaved(false);
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], note }
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    const allAttendance = JSON.parse(localStorage.getItem('spensa_attendance') || '[]');
    const today = new Date().toISOString().split('T')[0];
    
    // Remove old records for this class/date to prevent duplicates
    const otherRecords = allAttendance.filter((r: any) => !(r.date === today && r.classId === selectedClass));
    
    const newRecords = Object.entries(attendanceData).map(([studentId, data]: [string, { status: AttendanceStatus, note: string }]) => ({
      id: `${today}-${studentId}`,
      studentId,
      classId: selectedClass,
      date: today,
      status: data.status,
      note: data.note
    }));

    localStorage.setItem('spensa_attendance', JSON.stringify([...otherRecords, ...newRecords]));
    setIsSaved(true);
    
    // Auto hide success message
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExport = () => {
    const allAttendance = JSON.parse(localStorage.getItem('spensa_attendance') || '[]');
    const allStudents = JSON.parse(localStorage.getItem('spensa_students') || '[]');
    
    const exportData = allAttendance.map((record: any) => {
      const student = allStudents.find((s: any) => s.id === record.studentId);
      return {
        "ID Siswa": record.studentId,
        "Nama Siswa": student ? student.name : 'Unknown',
        "Kelas": record.classId,
        "Tanggal": record.date,
        "Status": record.status,
        "Keterangan": record.note
      };
    });

    exportToExcel(exportData, "Data_Absensi_SPENSAX");
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const jsonData = await importFromExcel(file);
      const allStudents = JSON.parse(localStorage.getItem('spensa_students') || '[]');
      
      const newRecords = jsonData.map((row: any) => {
         let studentId = row['ID Siswa'];
         if (!studentId) {
             const student = allStudents.find((s: any) => 
                s.name.toLowerCase() === row['Nama Siswa']?.toLowerCase() && 
                s.classId === row['Kelas']
             );
             if (student) studentId = student.id;
         }

         if (!studentId) return null;

         return {
             id: `${row['Tanggal']}-${studentId}`,
             studentId,
             classId: row['Kelas'],
             date: row['Tanggal'],
             status: row['Status'],
             note: row['Keterangan'] || ''
         };
      }).filter(Boolean);
      
      const currentData = JSON.parse(localStorage.getItem('spensa_attendance') || '[]');
      const merged = [...currentData.filter((c: any) => !newRecords.find((n: any) => n.id === c.id)), ...newRecords];
      
      localStorage.setItem('spensa_attendance', JSON.stringify(merged));
      alert('Data absensi berhasil di-import!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Gagal mengimport data.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Calculate Stats for current view
  const stats = {
    hadir: Object.values(attendanceData).filter((d: { status: AttendanceStatus }) => d.status === AttendanceStatus.HADIR).length,
    sakit: Object.values(attendanceData).filter((d: { status: AttendanceStatus }) => d.status === AttendanceStatus.SAKIT).length,
    izin: Object.values(attendanceData).filter((d: { status: AttendanceStatus }) => d.status === AttendanceStatus.IZIN).length,
    alpa: Object.values(attendanceData).filter((d: { status: AttendanceStatus }) => d.status === AttendanceStatus.ALPA).length,
    total: classStudents.length
  };

  const statusColors = {
    [AttendanceStatus.HADIR]: 'bg-emerald-500 text-white border-emerald-600',
    [AttendanceStatus.SAKIT]: 'bg-blue-500 text-white border-blue-600',
    [AttendanceStatus.IZIN]: 'bg-amber-500 text-white border-amber-600',
    [AttendanceStatus.ALPA]: 'bg-rose-500 text-white border-rose-600',
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
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Sistem Presensi</h1>
            <p className="text-slate-500 font-medium">{getSemesterLabel()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            accept=".xlsx, .xls" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all"
          >
            <Upload size={16} className="text-cyan-700" />
            Import
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all"
          >
            <Download size={16} className="text-slate-600" />
            Export
          </button>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          <button 
            onClick={() => setAttendanceType('STUDENT')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${attendanceType === 'STUDENT' ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' : 'text-slate-500'}`}
          >
            Presensi Siswa
          </button>
          <button 
            onClick={() => setAttendanceType('TEACHER')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${attendanceType === 'TEACHER' ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' : 'text-slate-500'}`}
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
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-teal-500"
                >
                  {CLASSES.map(c => <option key={c} value={c}>Kelas {c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <CalendarWidget />

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Rekapitulasi Hari Ini</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Hadir</span>
                <span className="text-sm font-black text-emerald-500">{stats.hadir}</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${stats.total ? (stats.hadir / stats.total) * 100 : 0}%` }}></div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-2">
                 <div className="bg-blue-50 p-2 rounded-lg text-center">
                    <div className="text-[10px] font-bold text-blue-400 uppercase">Sakit</div>
                    <div className="font-black text-blue-600">{stats.sakit}</div>
                 </div>
                 <div className="bg-amber-50 p-2 rounded-lg text-center">
                    <div className="text-[10px] font-bold text-amber-400 uppercase">Izin</div>
                    <div className="font-black text-amber-600">{stats.izin}</div>
                 </div>
                 <div className="bg-rose-50 p-2 rounded-lg text-center">
                    <div className="text-[10px] font-bold text-rose-400 uppercase">Alpa</div>
                    <div className="font-black text-rose-600">{stats.alpa}</div>
                 </div>
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
                    <div className={`w-3 h-3 rounded-full ${statusColors[status].split(' ')[0]}`}></div>
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
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status Kehadiran</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Catatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {classStudents.map((s, i) => {
                      const currentStatus = attendanceData[s.id]?.status;
                      const currentNote = attendanceData[s.id]?.note || '';
                      
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-all">
                          <td className="px-6 py-4 text-sm font-bold text-slate-400">{i + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${s.gender === Gender.MALE ? 'bg-teal-500' : 'bg-rose-500'}`}>
                                {s.name.charAt(0)}
                              </div>
                              <span className="text-sm font-bold text-slate-800">{s.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {Object.values(AttendanceStatus).map(status => (
                                <button 
                                  key={status} 
                                  onClick={() => handleStatusChange(s.id, status)}
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
                                    currentStatus === status 
                                    ? statusColors[status] 
                                    : 'bg-slate-50 text-slate-300 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <input 
                              type="text" 
                              placeholder="Keterangan..." 
                              value={currentNote}
                              onChange={(e) => handleNoteChange(s.id, e.target.value)}
                              className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-medium w-40 focus:ring-2 focus:ring-teal-500 transition-all" 
                            />
                          </td>
                        </tr>
                      );
                    })}
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
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
                <AnimatePresence>
                  {isSaved && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-emerald-600 font-bold text-sm"
                    >
                      <CheckCircle2 size={18} />
                      Data Tersimpan!
                    </motion.div>
                  )}
                </AnimatePresence>
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 px-8 py-3 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 shadow-xl shadow-teal-100 transition-all active:scale-95"
                >
                  <Save size={18} />
                  Simpan Presensi
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