
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileX, Trash2, Activity, Download, Upload } from 'lucide-react';
import { ExecutionStatus, DailyPlan } from '../types';
import { CLASSES, SUBJECTS, SCHOOL_LOGO } from '../constants';
import CalendarWidget from '../components/CalendarWidget';
import { exportToExcel, importFromExcel } from '../utils/excelUtils';

const PlanningPage: React.FC<{ role: string, username: string }> = ({ role, username }) => {
  const [plans, setPlans] = useState<DailyPlan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentPlan, setCurrentPlan] = useState<Partial<DailyPlan>>({
    date: new Date().toISOString().split('T')[0],
    period: '1-2',
    classId: CLASSES[0],
    subject: SUBJECTS[0],
    material: '',
    execution: ExecutionStatus.SESUAI,
    notes: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('spensa_plans');
    if (saved) setPlans(JSON.parse(saved));
  }, []);

  // Calculate Stats
  const stats = {
    lebih: plans.filter(p => p.execution === ExecutionStatus.LEBIH).length,
    kurang: plans.filter(p => p.execution === ExecutionStatus.KURANG).length,
    sesuai: plans.filter(p => p.execution === ExecutionStatus.SESUAI).length,
    total: plans.length
  };

  const handleSave = () => {
    const newPlans = [...plans, { 
      ...currentPlan as DailyPlan, 
      id: Date.now().toString(), 
      type: (role === 'WALAS' ? 'WALAS' : 'TEACHER') as 'TEACHER' | 'WALAS' | 'BK'
    }];
    setPlans(newPlans);
    localStorage.setItem('spensa_plans', JSON.stringify(newPlans));
    setIsModalOpen(false);
    
    // Reset form but keep date
    setCurrentPlan({
      date: currentPlan.date,
      period: '1-2',
      classId: CLASSES[0],
      subject: SUBJECTS[0],
      material: '',
      execution: ExecutionStatus.SESUAI,
      notes: ''
    });
  };

  const deletePlan = (id: string) => {
    if(window.confirm('Hapus rencana ini?')) {
      const filtered = plans.filter(p => p.id !== id);
      setPlans(filtered);
      localStorage.setItem('spensa_plans', JSON.stringify(filtered));
    }
  };

  const handleExport = () => {
    const exportData = plans.map(p => ({
      "Tanggal": p.date,
      "Jam Ke": p.period,
      "Kelas": p.classId,
      "Mapel": p.subject,
      "Materi": p.material,
      "Pelaksanaan": p.execution,
      "Catatan": p.notes
    }));
    exportToExcel(exportData, "Rencana_Harian_SPENSAX");
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const jsonData = await importFromExcel(file);
      const newPlans = jsonData.map((row: any, idx: number) => ({
        id: `import-${Date.now()}-${idx}`,
        date: row['Tanggal'],
        period: row['Jam Ke'],
        classId: row['Kelas'],
        subject: row['Mapel'],
        material: row['Materi'],
        execution: row['Pelaksanaan'] || ExecutionStatus.SESUAI,
        notes: row['Catatan'] || '',
        type: (role === 'WALAS' ? 'WALAS' : 'TEACHER') as 'TEACHER' | 'WALAS' | 'BK'
      }));

      const merged = [...plans, ...newPlans];
      setPlans(merged);
      localStorage.setItem('spensa_plans', JSON.stringify(merged));
      alert(`${newPlans.length} rencana berhasil di-import!`);
    } catch (err) {
      console.error(err);
      alert('Gagal import rencana.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Rencana Harian</h1>
            <p className="text-slate-500 font-medium">Draft kegiatan belajar mengajar mendatang.</p>
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
            className="px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Upload size={20} className="text-cyan-700" />
            Import
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Download size={20} className="text-slate-600" />
            Export
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all"
          >
            <Plus size={20} />
            Buat Rencana Baru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          
          <CalendarWidget />

          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl">
             <div className="flex items-center gap-2 mb-4">
                <Activity size={18} className="text-teal-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Rekapitulasi</h3>
             </div>
             
             <div className="space-y-4">
               <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/30">+</div>
                   <span className="text-xs font-bold text-emerald-400">Waktu Lebih</span>
                 </div>
                 <span className="text-xl font-black">{stats.lebih}</span>
               </div>

               <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center font-bold text-white shadow-lg shadow-rose-500/30">-</div>
                   <span className="text-xs font-bold text-rose-400">Waktu Kurang</span>
                 </div>
                 <span className="text-xl font-black">{stats.kurang}</span>
               </div>

               <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center font-bold text-white shadow-lg shadow-teal-500/30">0</div>
                   <span className="text-xs font-bold text-teal-400">Tepat Waktu</span>
                 </div>
                 <span className="text-xl font-black">{stats.sesuai}</span>
               </div>
             </div>
             
             <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Total Rencana</p>
                <p className="text-3xl font-black text-white">{stats.total}</p>
             </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
            {plans.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-32 text-center space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                  <FileX size={48} className="text-slate-200" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Belum Ada Rencana Harian</h3>
                  <p className="text-sm text-slate-400 max-w-xs mx-auto">Klik tombol 'Buat Rencana Baru' di atas untuk menyusun jadwal kegiatan mengajar Anda.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Waktu/Kelas</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Materi</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {plans.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-6 py-6">
                          <p className="text-sm font-black text-slate-900">{p.date}</p>
                          <p className="text-[10px] font-bold text-teal-600 uppercase">Jam {p.period} • {p.classId}</p>
                        </td>
                        <td className="px-6 py-6 max-w-xs">
                          <p className="text-sm font-bold text-slate-800">{p.material}</p>
                          <p className="text-[9px] text-slate-400 font-medium uppercase mt-1">{p.subject}</p>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 ${
                            p.execution === '+' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' :
                            p.execution === '-' ? 'border-rose-100 bg-rose-50 text-rose-600' :
                            'border-teal-100 bg-teal-50 text-teal-600'
                          }`}>
                             <span className="font-black text-sm">{p.execution}</span>
                             <span className="text-[10px] font-bold uppercase hidden xl:inline">
                               {p.execution === '+' ? 'Lebih' : p.execution === '-' ? 'Kurang' : 'Sesuai'}
                             </span>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <button onClick={() => deletePlan(p.id)} className="p-2 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
           <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Buat Rencana Harian</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tanggal</label>
                   <input type="date" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-teal-500" value={currentPlan.date} onChange={e => setCurrentPlan({...currentPlan, date: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Jam Ke</label>
                   <input type="text" placeholder="Contoh: 1-2" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-teal-500" value={currentPlan.period} onChange={e => setCurrentPlan({...currentPlan, period: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kelas</label>
                   <select className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-teal-500" value={currentPlan.classId} onChange={e => setCurrentPlan({...currentPlan, classId: e.target.value})}>
                     {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mapel</label>
                   <select className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-teal-500" value={currentPlan.subject} onChange={e => setCurrentPlan({...currentPlan, subject: e.target.value})}>
                     {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                 </div>
              </div>

              <div className="mb-6">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Estimasi Pelaksanaan</label>
                 <div className="grid grid-cols-3 gap-3">
                    {[
                      { val: ExecutionStatus.SESUAI, label: 'Sesuai (0)', color: 'bg-teal-50 text-teal-600 border-teal-200' },
                      { val: ExecutionStatus.LEBIH, label: 'Lebih (+)', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
                      { val: ExecutionStatus.KURANG, label: 'Kurang (-)', color: 'bg-rose-50 text-rose-600 border-rose-200' }
                    ].map((opt) => (
                      <button 
                        key={opt.val}
                        onClick={() => setCurrentPlan({...currentPlan, execution: opt.val})}
                        className={`py-3 rounded-2xl font-bold text-sm border-2 transition-all ${
                          currentPlan.execution === opt.val 
                          ? `${opt.color} ring-2 ring-offset-2 ring-slate-200` 
                          : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="mb-8">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Materi Pelajaran</label>
                 <textarea className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 h-24 resize-none focus:ring-2 focus:ring-teal-500" placeholder="Tuliskan materi..." value={currentPlan.material} onChange={e => setCurrentPlan({...currentPlan, material: e.target.value})}></textarea>
              </div>
              <div className="flex gap-4">
                 <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all">Batal</button>
                 <button onClick={handleSave} className="flex-1 py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 shadow-xl transition-all">Simpan Rencana</button>
              </div>
           </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default PlanningPage;
