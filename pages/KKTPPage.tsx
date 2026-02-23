import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Trash2, Edit2, Save, X, Filter, BarChart2 } from 'lucide-react';
import { KKTP, Role } from '../types';
import { SUBJECTS, GRADES } from '../constants';

const KKTPPage: React.FC<{ username: string }> = ({ username }) => {
  const [kktps, setKktps] = useState<KKTP[]>([]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [selectedGrade, setSelectedGrade] = useState(GRADES[0]);
  const [selectedSemester, setSelectedSemester] = useState<'1' | '2'>('1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentKktp, setCurrentKktp] = useState<Partial<KKTP>>({
    subject: SUBJECTS[0],
    grade: GRADES[0],
    semester: '1',
    tpCode: '',
    tpDescription: '',
    criteria: '',
    interval1: 'Belum Mencapai Ketuntasan, Remedial di seluruh bagian',
    interval2: 'Belum Mencapai Ketuntasan, Remedial di bagian yang diperlukan',
    interval3: 'Sudah Mencapai Ketuntasan, Tidak perlu remedial',
    interval4: 'Sudah Mencapai Ketuntasan, Perlu pengayaan atau tantangan lebih',
    range1Label: '0 - 40%',
    range2Label: '41 - 65%',
    range3Label: '66 - 85%',
    range4Label: '86 - 100%'
  });

  useEffect(() => {
    const savedKktps = localStorage.getItem('spensa_kktps');
    if (savedKktps) {
      setKktps(JSON.parse(savedKktps));
    }
  }, []);

  const handleSave = () => {
    if (!currentKktp.tpCode || !currentKktp.tpDescription) {
      alert('Mohon lengkapi Kode TP dan Deskripsi TP.');
      return;
    }

    const newKktp: KKTP = {
      id: currentKktp.id || Date.now().toString(),
      teacherId: username,
      subject: currentKktp.subject || selectedSubject,
      grade: currentKktp.grade || selectedGrade,
      semester: currentKktp.semester as '1' | '2' || selectedSemester,
      tpCode: currentKktp.tpCode,
      tpDescription: currentKktp.tpDescription,
      criteria: currentKktp.criteria || '',
      interval1: currentKktp.interval1 || '',
      interval2: currentKktp.interval2 || '',
      interval3: currentKktp.interval3 || '',
      interval4: currentKktp.interval4 || '',
      range1Label: currentKktp.range1Label || '0 - 40%',
      range2Label: currentKktp.range2Label || '41 - 65%',
      range3Label: currentKktp.range3Label || '66 - 85%',
      range4Label: currentKktp.range4Label || '86 - 100%'
    };

    let updatedKktps;
    if (currentKktp.id) {
      updatedKktps = kktps.map(k => k.id === currentKktp.id ? newKktp : k);
    } else {
      updatedKktps = [...kktps, newKktp];
    }

    setKktps(updatedKktps);
    localStorage.setItem('spensa_kktps', JSON.stringify(updatedKktps));
    setIsModalOpen(false);
    setCurrentKktp({
      subject: selectedSubject,
      grade: selectedGrade,
      semester: selectedSemester,
      tpCode: '',
      tpDescription: '',
      criteria: '',
      interval1: 'Belum Mencapai Ketuntasan, Remedial di seluruh bagian',
      interval2: 'Belum Mencapai Ketuntasan, Remedial di bagian yang diperlukan',
      interval3: 'Sudah Mencapai Ketuntasan, Tidak perlu remedial',
      interval4: 'Sudah Mencapai Ketuntasan, Perlu pengayaan atau tantangan lebih',
      range1Label: '0 - 40%',
      range2Label: '41 - 65%',
      range3Label: '66 - 85%',
      range4Label: '86 - 100%'
    });
  };

  const handleEdit = (kktp: KKTP) => {
    setCurrentKktp(kktp);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus KKTP ini?')) {
      const updated = kktps.filter(k => k.id !== id);
      setKktps(updated);
      localStorage.setItem('spensa_kktps', JSON.stringify(updated));
    }
  };

  const filteredKktps = kktps.filter(k => 
    k.teacherId === username &&
    k.subject === selectedSubject &&
    k.grade === selectedGrade &&
    k.semester === selectedSemester
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Kriteria Ketercapaian TP (KKTP)</h1>
            <p className="text-slate-500 font-medium">Penentuan interval nilai dan deskripsi kriteria.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-cyan-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-cyan-700 shadow-lg shadow-cyan-200 transition-all"
        >
          <Plus size={18} />
          Tambah KKTP
        </button>
      </div>

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
        <div className="w-32">
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Semester</label>
          <select 
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value as '1' | '2')}
            className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 font-bold text-slate-700 focus:ring-2 focus:ring-cyan-500"
          >
            <option value="1">Ganjil</option>
            <option value="2">Genap</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredKktps.map((kktp) => (
          <motion.div 
            key={kktp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-lg text-sm font-bold">
                  TP {kktp.tpCode}
                </span>
                <h3 className="font-bold text-slate-800 text-sm md:text-base line-clamp-1">{kktp.tpDescription}</h3>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(kktp)}
                  className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(kktp.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                <div className="text-xs font-bold text-rose-600 uppercase mb-2">{kktp.range1Label || '0 - 40%'} (Perlu Bimbingan)</div>
                <p className="text-sm text-slate-600">{kktp.interval1}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <div className="text-xs font-bold text-orange-600 uppercase mb-2">{kktp.range2Label || '41 - 65%'} (Cukup)</div>
                <p className="text-sm text-slate-600">{kktp.interval2}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="text-xs font-bold text-blue-600 uppercase mb-2">{kktp.range3Label || '66 - 85%'} (Baik)</div>
                <p className="text-sm text-slate-600">{kktp.interval3}</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <div className="text-xs font-bold text-emerald-600 uppercase mb-2">{kktp.range4Label || '86 - 100%'} (Sangat Baik)</div>
                <p className="text-sm text-slate-600">{kktp.interval4}</p>
              </div>
            </div>
            
            {kktp.criteria && (
              <div className="px-6 pb-6 pt-0">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Deskripsi Kriteria Tambahan</p>
                  <p className="text-sm text-slate-700">{kktp.criteria}</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {filteredKktps.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed">
            <BarChart2 size={32} className="mx-auto mb-2 opacity-50 text-slate-400" />
            <p className="text-sm font-bold text-slate-500">Belum ada data KKTP.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                {currentKktp.id ? 'Edit KKTP' : 'Tambah KKTP Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kode TP</label>
                  <input 
                    type="text" 
                    value={currentKktp.tpCode}
                    onChange={(e) => setCurrentKktp({...currentKktp, tpCode: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-cyan-500"
                    placeholder="Contoh: 7.1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Deskripsi TP</label>
                  <input 
                    type="text" 
                    value={currentKktp.tpDescription}
                    onChange={(e) => setCurrentKktp({...currentKktp, tpDescription: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-cyan-500"
                    placeholder="Deskripsi singkat TP"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Deskripsi Kriteria (Opsional)</label>
                <textarea 
                  value={currentKktp.criteria}
                  onChange={(e) => setCurrentKktp({...currentKktp, criteria: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-cyan-500 min-h-[80px]"
                  placeholder="Tambahkan catatan khusus untuk kriteria ini..."
                />
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-800">Interval Nilai & Tindak Lanjut</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-rose-500 uppercase mb-1">Rentang Nilai (Perlu Bimbingan)</label>
                    <input 
                      type="text" 
                      value={currentKktp.range1Label}
                      onChange={(e) => setCurrentKktp({...currentKktp, range1Label: e.target.value})}
                      className="w-full bg-rose-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-rose-700 mb-2"
                      placeholder="Contoh: 0 - 40%"
                    />
                    <textarea 
                      value={currentKktp.interval1}
                      onChange={(e) => setCurrentKktp({...currentKktp, interval1: e.target.value})}
                      className="w-full bg-rose-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-rose-500 text-rose-900 placeholder-rose-300 min-h-[80px]"
                      placeholder="Deskripsi tindak lanjut..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-orange-500 uppercase mb-1">Rentang Nilai (Cukup)</label>
                    <input 
                      type="text" 
                      value={currentKktp.range2Label}
                      onChange={(e) => setCurrentKktp({...currentKktp, range2Label: e.target.value})}
                      className="w-full bg-orange-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-orange-700 mb-2"
                      placeholder="Contoh: 41 - 65%"
                    />
                    <textarea 
                      value={currentKktp.interval2}
                      onChange={(e) => setCurrentKktp({...currentKktp, interval2: e.target.value})}
                      className="w-full bg-orange-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-orange-500 text-orange-900 placeholder-orange-300 min-h-[80px]"
                      placeholder="Deskripsi tindak lanjut..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-blue-500 uppercase mb-1">Rentang Nilai (Baik)</label>
                    <input 
                      type="text" 
                      value={currentKktp.range3Label}
                      onChange={(e) => setCurrentKktp({...currentKktp, range3Label: e.target.value})}
                      className="w-full bg-blue-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-blue-700 mb-2"
                      placeholder="Contoh: 66 - 85%"
                    />
                    <textarea 
                      value={currentKktp.interval3}
                      onChange={(e) => setCurrentKktp({...currentKktp, interval3: e.target.value})}
                      className="w-full bg-blue-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 text-blue-900 placeholder-blue-300 min-h-[80px]"
                      placeholder="Deskripsi tindak lanjut..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-500 uppercase mb-1">Rentang Nilai (Sangat Baik)</label>
                    <input 
                      type="text" 
                      value={currentKktp.range4Label}
                      onChange={(e) => setCurrentKktp({...currentKktp, range4Label: e.target.value})}
                      className="w-full bg-emerald-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-emerald-700 mb-2"
                      placeholder="Contoh: 86 - 100%"
                    />
                    <textarea 
                      value={currentKktp.interval4}
                      onChange={(e) => setCurrentKktp({...currentKktp, interval4: e.target.value})}
                      className="w-full bg-emerald-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 text-emerald-900 placeholder-emerald-300 min-h-[80px]"
                      placeholder="Deskripsi tindak lanjut..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 py-3 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 shadow-lg shadow-cyan-200 transition-all flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Simpan KKTP
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default KKTPPage;
