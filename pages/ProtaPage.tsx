import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, Download, Upload, BookOpen } from 'lucide-react';
import { Prota } from '../types';
import { SUBJECTS, GRADES, SCHOOL_LOGO } from '../constants';
import { exportToExcel, importFromExcel } from '../utils/excelUtils';

const ProtaPage: React.FC<{ username: string }> = ({ username }) => {
  const [protas, setProtas] = useState<Prota[]>([]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [selectedGrade, setSelectedGrade] = useState(GRADES[0]);
  const [selectedSemester, setSelectedSemester] = useState<'1' | '2'>('1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProta, setCurrentProta] = useState<Partial<Prota>>({
    topic: '',
    allocation: 2
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('spensa_protas');
    if (saved) setProtas(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    if (!currentProta.topic) return;

    const newProta: Prota = {
      id: currentProta.id || Date.now().toString(),
      teacherId: username,
      subject: selectedSubject,
      grade: selectedGrade,
      semester: selectedSemester,
      topic: currentProta.topic,
      allocation: Number(currentProta.allocation) || 0
    };

    let updatedProtas;
    if (currentProta.id) {
      updatedProtas = protas.map(p => p.id === currentProta.id ? newProta : p);
    } else {
      updatedProtas = [...protas, newProta];
    }

    setProtas(updatedProtas);
    localStorage.setItem('spensa_protas', JSON.stringify(updatedProtas));
    setIsModalOpen(false);
    setCurrentProta({ topic: '', allocation: 2 });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus data ini?')) {
      const updated = protas.filter(p => p.id !== id);
      setProtas(updated);
      localStorage.setItem('spensa_protas', JSON.stringify(updated));
    }
  };

  const filteredProtas = protas.filter(p => 
    p.teacherId === username &&
    p.subject === selectedSubject &&
    p.grade === selectedGrade &&
    p.semester === selectedSemester
  );

  const totalAllocation = filteredProtas.reduce((sum, p) => sum + p.allocation, 0);

  const handleExport = () => {
    const data = filteredProtas.map((p, i) => ({
      "No": i + 1,
      "Materi Pokok / Kompetensi Dasar": p.topic,
      "Alokasi Waktu (JP)": p.allocation
    }));
    exportToExcel(data, `Prota_${selectedSubject}_Kelas${selectedGrade}_Sem${selectedSemester}`);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const jsonData = await importFromExcel(file);
      const newProtas = jsonData.map((row: any) => ({
        id: `import-${Date.now()}-${Math.random()}`,
        teacherId: username,
        subject: selectedSubject,
        grade: selectedGrade,
        semester: selectedSemester,
        topic: row['Materi Pokok / Kompetensi Dasar'] || row['Materi'] || '',
        allocation: Number(row['Alokasi Waktu (JP)']) || Number(row['JP']) || 0
      })).filter((p: any) => p.topic);

      const merged = [...protas, ...newProtas];
      setProtas(merged);
      localStorage.setItem('spensa_protas', JSON.stringify(merged));
      alert(`${newProtas.length} data berhasil di-import!`);
    } catch (err) {
      console.error(err);
      alert('Gagal import data.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Program Tahunan</h1>
            <p className="text-slate-500 font-medium">Perencanaan pembelajaran satu tahun ajaran.</p>
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
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all"
          >
            <Upload size={18} className="text-cyan-700" />
            Import
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all"
          >
            <Download size={18} className="text-slate-600" />
            Export
          </button>
          <button 
            onClick={() => {
              setCurrentProta({ topic: '', allocation: 2 });
              setIsModalOpen(true);
            }}
            className="px-6 py-2 bg-teal-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-teal-700 shadow-lg shadow-teal-200 transition-all"
          >
            <Plus size={18} />
            Tambah Materi
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Mata Pelajaran</label>
          <select 
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 font-bold text-slate-700 focus:ring-2 focus:ring-cyan-500"
          >
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="w-32">
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Kelas</label>
          <select 
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 font-bold text-slate-700 focus:ring-2 focus:ring-cyan-500"
          >
            {GRADES.map(g => <option key={g} value={g}>Kelas {g}</option>)}
          </select>
        </div>
        <div className="w-40">
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Semester</label>
          <div className="flex bg-slate-50 rounded-xl p-1">
            <button 
              onClick={() => setSelectedSemester('1')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedSemester === '1' ? 'bg-white shadow text-cyan-700' : 'text-slate-400'}`}
            >
              Gasal
            </button>
            <button 
              onClick={() => setSelectedSemester('2')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedSemester === '2' ? 'bg-white shadow text-cyan-700' : 'text-slate-400'}`}
            >
              Genap
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase w-16 text-center">No</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Materi Pokok / Kompetensi Dasar</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase w-32 text-center">Alokasi (JP)</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase w-24 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredProtas.map((prota, idx) => (
              <tr key={prota.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 text-sm font-bold text-slate-500 text-center">{idx + 1}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">{prota.topic}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-700 text-center">{prota.allocation} JP</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setCurrentProta(prota);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(prota.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProtas.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold">Belum ada data program tahunan.</p>
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-slate-50 border-t border-slate-100">
            <tr>
              <td colSpan={2} className="px-6 py-4 text-sm font-bold text-slate-600 text-right">Total Alokasi Waktu</td>
              <td className="px-6 py-4 text-sm font-bold text-cyan-700 text-center">{totalAllocation} JP</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {currentProta.id ? 'Edit Materi' : 'Tambah Materi Baru'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Materi Pokok / KD</label>
                <textarea 
                  value={currentProta.topic}
                  onChange={(e) => setCurrentProta({...currentProta, topic: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-cyan-500 h-32 resize-none"
                  placeholder="Masukkan deskripsi materi..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Alokasi Waktu (JP)</label>
                <input 
                  type="number" 
                  value={currentProta.allocation}
                  onChange={(e) => setCurrentProta({...currentProta, allocation: Number(e.target.value)})}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-cyan-500"
                  min="1"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 py-2.5 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 shadow-lg shadow-cyan-200 transition-all"
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

export default ProtaPage;
