import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, Download, Upload, Target } from 'lucide-react';
import { TP } from '../types';
import { SUBJECTS, GRADES, SCHOOL_LOGO } from '../constants';
import { exportToExcel, importFromExcel } from '../utils/excelUtils';

const TPPage: React.FC<{ username: string }> = ({ username }) => {
  const [tps, setTps] = useState<TP[]>([]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [selectedGrade, setSelectedGrade] = useState(GRADES[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTP, setCurrentTP] = useState<Partial<TP>>({
    code: '',
    element: '',
    description: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('spensa_tps');
    if (saved) setTps(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    if (!currentTP.code || !currentTP.description) return;

    const newTP: TP = {
      id: currentTP.id || Date.now().toString(),
      teacherId: username,
      subject: selectedSubject,
      grade: selectedGrade,
      code: currentTP.code,
      element: currentTP.element || '',
      description: currentTP.description
    };

    let updatedTPs;
    if (currentTP.id) {
      updatedTPs = tps.map(t => t.id === currentTP.id ? newTP : t);
    } else {
      updatedTPs = [...tps, newTP];
    }

    setTps(updatedTPs);
    localStorage.setItem('spensa_tps', JSON.stringify(updatedTPs));
    setIsModalOpen(false);
    setCurrentTP({ code: '', element: '', description: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus Tujuan Pembelajaran ini?')) {
      const updated = tps.filter(t => t.id !== id);
      setTps(updated);
      localStorage.setItem('spensa_tps', JSON.stringify(updated));
    }
  };

  const filteredTPs = tps.filter(t => 
    t.teacherId === username &&
    t.subject === selectedSubject &&
    t.grade === selectedGrade
  ).sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));

  const handleExport = () => {
    const data = filteredTPs.map((t, i) => ({
      "No": i + 1,
      "Kode TP": t.code,
      "Elemen CP": t.element,
      "Deskripsi Tujuan Pembelajaran": t.description
    }));
    exportToExcel(data, `TP_${selectedSubject}_Kelas${selectedGrade}`);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const jsonData = await importFromExcel(file);
      const newTPs = jsonData.map((row: any) => ({
        id: `import-${Date.now()}-${Math.random()}`,
        teacherId: username,
        subject: selectedSubject,
        grade: selectedGrade,
        code: row['Kode TP'] || row['Kode'] || '',
        element: row['Elemen CP'] || row['Elemen'] || '',
        description: row['Deskripsi Tujuan Pembelajaran'] || row['Deskripsi'] || ''
      })).filter((t: any) => t.code && t.description);

      const merged = [...tps, ...newTPs];
      setTps(merged);
      localStorage.setItem('spensa_tps', JSON.stringify(merged));
      alert(`${newTPs.length} data TP berhasil di-import!`);
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
            <h1 className="text-2xl font-bold text-slate-900">Tujuan Pembelajaran (TP)</h1>
            <p className="text-slate-500 font-medium">Daftar tujuan pembelajaran Kurikulum Merdeka.</p>
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
              setCurrentTP({ code: '', element: '', description: '' });
              setIsModalOpen(true);
            }}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
          >
            <Plus size={18} />
            Tambah TP
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase w-24">Kode TP</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase w-48">Elemen CP</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Deskripsi Tujuan Pembelajaran</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase w-24 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredTPs.map((tp) => (
              <tr key={tp.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 text-sm font-bold text-slate-700">{tp.code}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600">
                  <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs">{tp.element || '-'}</span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">{tp.description}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setCurrentTP(tp);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(tp.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredTPs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  <Target size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold">Belum ada data Tujuan Pembelajaran.</p>
                </td>
              </tr>
            )}
          </tbody>
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
              {currentTP.id ? 'Edit TP' : 'Tambah TP Baru'}
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kode TP</label>
                  <input 
                    type="text" 
                    value={currentTP.code}
                    onChange={(e) => setCurrentTP({...currentTP, code: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 7.1"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Elemen CP</label>
                  <input 
                    type="text" 
                    value={currentTP.element}
                    onChange={(e) => setCurrentTP({...currentTP, element: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Bilangan"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Deskripsi Tujuan Pembelajaran</label>
                <textarea 
                  value={currentTP.description}
                  onChange={(e) => setCurrentTP({...currentTP, description: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
                  placeholder="Peserta didik dapat..."
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
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
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

export default TPPage;
