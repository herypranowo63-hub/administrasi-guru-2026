
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Download, 
  Upload, 
  Edit2, 
  Trash2, 
  ChevronRight,
  Filter,
  Users,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Student, Gender } from '../types';
import { CLASSES } from '../constants';

interface StudentsPageProps {
  role: string;
  classFilter?: string;
}

const StudentsPage: React.FC<StudentsPageProps> = ({ role, classFilter }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState(classFilter || CLASSES[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Partial<Student>>({ name: '', gender: Gender.MALE });
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('spensa_students');
    if (saved) {
      setStudents(JSON.parse(saved));
    } else {
      const dummy: Student[] = [
        { id: '1', name: 'Aditya Pratama', gender: Gender.MALE, classId: '7A' },
        { id: '2', name: 'Bella Safira', gender: Gender.FEMALE, classId: '7A' },
      ];
      setStudents(dummy);
      localStorage.setItem('spensa_students', JSON.stringify(dummy));
    }
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const saveToLocal = (data: Student[]) => {
    setStudents(data);
    localStorage.setItem('spensa_students', JSON.stringify(data));
  };

  const handleAddEdit = () => {
    if (!currentStudent.name) return;

    if (currentStudent.id) {
      const updated = students.map(s => s.id === currentStudent.id ? { ...s, ...currentStudent } as Student : s);
      saveToLocal(updated);
      showNotification('Data siswa berhasil diperbarui', 'success');
    } else {
      const newStudent: Student = {
        id: Date.now().toString(),
        name: currentStudent.name!,
        gender: currentStudent.gender! as Gender,
        classId: selectedClass,
      };
      saveToLocal([...students, newStudent]);
      showNotification('Siswa baru berhasil ditambahkan', 'success');
    }
    setIsModalOpen(false);
    setCurrentStudent({ name: '', gender: Gender.MALE });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus data siswa ini?')) {
      const filtered = students.filter(s => s.id !== id);
      saveToLocal(filtered);
      showNotification('Data siswa telah dihapus', 'success');
    }
  };

  const downloadTemplate = () => {
    const headers = "Kelas,Nama Siswa,Jenis Kelamin (Laki-laki/Perempuan)\n";
    const example = "7A,Contoh Nama Siswa,Laki-laki\n7A,Contoh Nama Siswi,Perempuan";
    const blob = new Blob([headers + example], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Template_Upload_Siswa_SPENSAX.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const newStudents: Student[] = [...students];
      let importCount = 0;

      // Skip header (i=0)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const columns = line.split(',');
        if (columns.length >= 3) {
          const classId = columns[0].trim().toUpperCase();
          const name = columns[1].trim();
          const genderStr = columns[2].trim().toLowerCase();
          
          let gender = Gender.MALE;
          if (genderStr.includes('perempuan') || genderStr === 'p' || genderStr === 'f') {
            gender = Gender.FEMALE;
          }

          if (name && CLASSES.includes(classId)) {
            newStudents.push({
              id: `import-${Date.now()}-${importCount}`,
              name,
              gender,
              classId
            });
            importCount++;
          }
        }
      }

      if (importCount > 0) {
        saveToLocal(newStudents);
        showNotification(`${importCount} data siswa berhasil di-import!`, 'success');
      } else {
        showNotification('Tidak ada data valid yang ditemukan.', 'error');
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const filteredStudents = students
    .filter(s => s.classId === selectedClass && s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleExport = () => {
    const csvData = "Kelas,Nama Siswa,Jenis Kelamin\n" + 
      filteredStudents.map(s => `${s.classId},${s.name},${s.gender}`).join("\n");
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Data_Siswa_${selectedClass}.csv`;
    a.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 relative"
    >
      {/* Notification Toast */}
      {notification && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-20 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-l-8 ${
            notification.type === 'success' ? 'bg-white border-emerald-500 text-emerald-800' : 'bg-white border-rose-500 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-rose-500" />}
          <span className="font-bold text-sm">{notification.message}</span>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Database Siswa</h1>
          <p className="text-slate-500 font-medium">Kelola data murid per kelas secara efisien.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".csv" 
            className="hidden" 
          />
          <button 
            onClick={downloadTemplate}
            className="px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-emerald-100 transition-all border border-emerald-100"
          >
            <FileSpreadsheet size={16} />
            Download Template
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all"
          >
            <Upload size={16} className="text-blue-600" />
            Upload CSV
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all"
          >
            <Download size={16} className="text-slate-600" />
            Export Data
          </button>
          <button 
            onClick={() => {
              setCurrentStudent({ name: '', gender: Gender.MALE });
              setIsModalOpen(true);
            }}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
          >
            <Plus size={18} />
            Tambah Siswa
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama siswa..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={!!classFilter}
            >
              {CLASSES.map(c => <option key={c} value={c}>Kelas {c}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">No</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Nama Siswa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Jenis Kelamin</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-bold text-slate-400">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${student.gender === Gender.MALE ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>
                          {student.name.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-slate-800">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        student.gender === Gender.MALE 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'bg-rose-50 text-rose-600'
                      }`}>
                        {student.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setCurrentStudent(student);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(student.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <ChevronRight size={16} className="text-slate-300" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <Users size={48} />
                      <p className="font-bold">Tidak ada data siswa ditemukan.</p>
                      <p className="text-xs">Klik 'Download Template' untuk mulai menginput data secara massal.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{currentStudent.id ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl font-light">&times;</button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={currentStudent.name}
                  onChange={(e) => setCurrentStudent({...currentStudent, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                  placeholder="Contoh: Andi Pratama"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Jenis Kelamin</label>
                <div className="flex gap-4">
                  {[Gender.MALE, Gender.FEMALE].map(g => (
                    <button
                      key={g}
                      onClick={() => setCurrentStudent({...currentStudent, gender: g})}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                        currentStudent.gender === g 
                        ? 'border-blue-600 bg-blue-50 text-blue-600' 
                        : 'border-slate-100 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={handleAddEdit}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                Simpan Data
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default StudentsPage;
