
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
import { CLASSES, SCHOOL_LOGO } from '../constants';
import * as XLSX from 'xlsx';

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
    const templateData = [
      { "Kelas": "7A", "Nama Siswa": "Contoh Nama Siswa", "Jenis Kelamin": "Laki-laki" },
      { "Kelas": "7A", "Nama Siswa": "Contoh Nama Siswi", "Jenis Kelamin": "Perempuan" }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Template_Upload_Siswa_SPENSAX.xlsx");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const newStudents: Student[] = [...students];
        let importCount = 0;

        jsonData.forEach((row: any) => {
          const classId = row['Kelas']?.toString().trim().toUpperCase();
          const name = row['Nama Siswa']?.toString().trim();
          const genderStr = row['Jenis Kelamin']?.toString().trim().toLowerCase();

          if (classId && name && CLASSES.includes(classId)) {
            let gender = Gender.MALE;
            if (genderStr && (genderStr.includes('perempuan') || genderStr === 'p' || genderStr === 'f')) {
              gender = Gender.FEMALE;
            }

            newStudents.push({
              id: `import-${Date.now()}-${importCount}`,
              name,
              gender,
              classId
            });
            importCount++;
          }
        });

        if (importCount > 0) {
          saveToLocal(newStudents);
          showNotification(`${importCount} data siswa berhasil di-import!`, 'success');
        } else {
          showNotification('Tidak ada data valid yang ditemukan.', 'error');
        }
      } catch (error) {
        console.error("Error importing Excel:", error);
        showNotification('Gagal membaca file Excel.', 'error');
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredStudents = students
    .filter(s => s.classId === selectedClass && s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleExport = () => {
    const exportData = filteredStudents.map(s => ({
      "Kelas": s.classId,
      "Nama Siswa": s.name,
      "Jenis Kelamin": s.gender
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Siswa");
    XLSX.writeFile(wb, `Data_Siswa_${selectedClass}.xlsx`);
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
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Database Siswa</h1>
            <p className="text-slate-500 font-medium">Kelola data murid per kelas secara efisien.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".xlsx, .xls" 
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
            <Upload size={16} className="text-cyan-700" />
            Upload Excel
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all"
          >
            <Download size={16} className="text-slate-600" />
            Export Excel
          </button>
          <button 
            onClick={() => {
              setCurrentStudent({ name: '', gender: Gender.MALE });
              setIsModalOpen(true);
            }}
            className="px-6 py-2.5 bg-cyan-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-cyan-800 shadow-lg shadow-cyan-200 transition-all"
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
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-cyan-600 text-sm font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-cyan-600 disabled:opacity-50"
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
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-400">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${student.gender === Gender.MALE ? 'bg-cyan-500' : 'bg-rose-500'}`}>
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-slate-800">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      student.gender === Gender.MALE ? 'bg-cyan-50 text-cyan-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {student.gender === Gender.MALE ? 'Laki-laki' : 'Perempuan'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setCurrentStudent(student);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    <Users size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-bold">Tidak ada data siswa ditemukan.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              {currentStudent.id ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
            </h2>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={currentStudent.name}
                  onChange={(e) => setCurrentStudent({...currentStudent, name: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-cyan-500"
                  placeholder="Masukkan nama siswa..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Jenis Kelamin</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setCurrentStudent({...currentStudent, gender: Gender.MALE})}
                    className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                      currentStudent.gender === Gender.MALE 
                      ? 'bg-cyan-50 text-cyan-600 border-cyan-200' 
                      : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'
                    }`}
                  >
                    Laki-laki
                  </button>
                  <button 
                    onClick={() => setCurrentStudent({...currentStudent, gender: Gender.FEMALE})}
                    className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                      currentStudent.gender === Gender.FEMALE 
                      ? 'bg-rose-50 text-rose-600 border-rose-200' 
                      : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'
                    }`}
                  >
                    Perempuan
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                Batal
              </button>
              <button 
                onClick={handleAddEdit}
                className="flex-1 py-3 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 shadow-lg shadow-cyan-200 transition-all"
              >
                Simpan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default StudentsPage;
