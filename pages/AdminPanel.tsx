
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle,
  RefreshCcw,
  Settings,
  Terminal,
  CheckCircle2,
  FileCode,
  Globe,
  Rocket,
  PieChart,
  BarChart2,
  List,
  ClipboardCheck,
  Search,
  UserCheck
} from 'lucide-react';
import { DailyPlan, ExecutionStatus, TeacherJournal } from '../types';

const AdminPanel: React.FC = () => {
  const [plans, setPlans] = useState<DailyPlan[]>([]);
  const [journals, setJournals] = useState<TeacherJournal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const savedPlans = localStorage.getItem('spensa_plans');
    const savedJournals = localStorage.getItem('spensa_journals');
    
    if (savedPlans) setPlans(JSON.parse(savedPlans));
    if (savedJournals) setJournals(JSON.parse(savedJournals));
  }, []);

  const stats = {
    total: plans.length,
    sesuai: plans.filter(p => p.execution === ExecutionStatus.SESUAI).length,
    lebih: plans.filter(p => p.execution === ExecutionStatus.LEBIH).length,
    kurang: plans.filter(p => p.execution === ExecutionStatus.KURANG).length,
  };

  const getPercentage = (val: number) => {
    if (stats.total === 0) return 0;
    return Math.round((val / stats.total) * 100);
  };

  // Group Journals by Teacher
  const teacherStats = journals.reduce((acc, curr) => {
    const name = curr.teacherName || 'Tanpa Nama';
    if (!acc[name]) {
      acc[name] = { count: 0, lastDate: curr.date };
    }
    acc[name].count += 1;
    if (new Date(curr.date) > new Date(acc[name].lastDate)) {
      acc[name].lastDate = curr.date;
    }
    return acc;
  }, {} as Record<string, { count: number; lastDate: string }>);

  const teacherList = (Object.entries(teacherStats) as [string, { count: number; lastDate: string }][])
    .filter(([name]) => name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b[1].count - a[1].count);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
            <Shield className="text-blue-600" /> Admin Control
          </h1>
          <p className="text-slate-500 font-medium italic">"Pusat kendali dan rekapitulasi sistem."</p>
        </div>
      </div>

      {/* REKAPITULASI RENCANA HARIAN */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
         <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
               <PieChart size={24} />
            </div>
            <div>
               <h2 className="text-xl font-bold text-slate-900">Analisis Rencana Pembelajaran</h2>
               <p className="text-sm text-slate-500">Rekapitulasi ketepatan waktu pelaksanaan rencana harian guru.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                     <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Tepat Waktu (0)</span>
                     <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-blue-600 shadow-sm">{getPercentage(stats.sesuai)}%</span>
                  </div>
                  <h3 className="text-4xl font-black text-blue-900 mb-1">{stats.sesuai}</h3>
                  <p className="text-xs font-bold text-blue-400">Rencana Terlaksana</p>
               </div>
               <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
            </div>

            <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                     <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Waktu Lebih (+)</span>
                     <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-emerald-600 shadow-sm">{getPercentage(stats.lebih)}%</span>
                  </div>
                  <h3 className="text-4xl font-black text-emerald-900 mb-1">{stats.lebih}</h3>
                  <p className="text-xs font-bold text-emerald-400">Rencana Terlaksana</p>
               </div>
               <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
            </div>

            <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100 relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                     <span className="text-xs font-black text-rose-400 uppercase tracking-widest">Waktu Kurang (-)</span>
                     <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-rose-600 shadow-sm">{getPercentage(stats.kurang)}%</span>
                  </div>
                  <h3 className="text-4xl font-black text-rose-900 mb-1">{stats.kurang}</h3>
                  <p className="text-xs font-bold text-rose-400">Rencana Terlaksana</p>
               </div>
               <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rose-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
            </div>
         </div>
      </div>

      {/* MONITORING JURNAL GURU */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                  <ClipboardCheck size={24} />
              </div>
              <div>
                  <h2 className="text-xl font-bold text-slate-900">Monitoring Jurnal Guru</h2>
                  <p className="text-sm text-slate-500">Daftar guru yang telah menginput jurnal mengajar.</p>
              </div>
            </div>
            <div className="relative">
               <input 
                  type="text" 
                  placeholder="Cari nama guru..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-sm font-bold w-full md:w-64 focus:ring-2 focus:ring-blue-500"
               />
               <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            </div>
         </div>

         <div className="overflow-hidden rounded-2xl border border-slate-100">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 text-slate-500">
                     <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Nama Guru</th>
                     <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-center">Total Jurnal</th>
                     <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-center">Input Terakhir</th>
                     <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-right">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {teacherList.length > 0 ? (
                    teacherList.map(([name, stat], idx) => (
                      <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                  {name.charAt(0).toUpperCase()}
                               </div>
                               <span className="font-bold text-slate-800">{name}</span>
                            </div>
                         </td>
                         <td className="px-6 py-4 text-center">
                            <span className="px-3 py-1 bg-slate-100 rounded-lg font-black text-slate-700">{stat.count}</span>
                         </td>
                         <td className="px-6 py-4 text-center text-sm font-medium text-slate-600">
                            {new Date(stat.lastDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                               <CheckCircle2 size={12} />
                               <span className="text-[10px] font-bold uppercase">Aktif</span>
                            </div>
                         </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                       <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                          <UserCheck size={32} className="mx-auto mb-2 opacity-50" />
                          <p className="text-sm font-bold">Belum ada data jurnal guru yang ditemukan.</p>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[3rem] border-[6px] border-slate-900 shadow-2xl overflow-hidden">
          <div className="bg-rose-500 p-6 text-white flex items-center gap-4">
            <AlertTriangle size={32} className="animate-pulse" />
            <div>
              <h2 className="font-black uppercase text-xl">SOLUSI 404 NOT FOUND</h2>
              <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Wajib Dilakukan di Vercel Dashboard</p>
            </div>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black flex-shrink-0">1</div>
                <p className="text-sm font-bold text-slate-700">Buka Vercel Dashboard, klik proyek <b>spensax-digital</b> Bapak/Ibu.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black flex-shrink-0">2</div>
                <p className="text-sm font-bold text-slate-700">Klik tab <b>Settings</b> (di bagian atas) kemudian pilih <b>General</b>.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black flex-shrink-0">3</div>
                <p className="text-sm font-bold text-slate-700">Di bagian <b>Build & Development Settings</b>, pastikan <u>Framework Preset</u> adalah: <span className="text-blue-600">VITE</span>.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black flex-shrink-0">4</div>
                <p className="text-sm font-bold text-slate-700">Klik <b>SAVE</b> dan lakukan Redeploy.</p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
               <div className="flex items-center gap-3 mb-2 text-slate-400">
                 <Terminal size={18} />
                 <span className="text-[10px] font-black uppercase">Root Directory Check</span>
               </div>
               <p className="text-xs font-bold text-slate-500 italic">"Pastikan Bapak/Ibu tidak memasukkan file ke dalam folder lagi di GitHub. File <b>index.html</b> dan <b>package.json</b> harus langsung terlihat saat membuka link GitHub."</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                  <FileCode className="text-blue-400" /> FILE WAJIB ADA
                </h3>
                <div className="space-y-3">
                  {['index.html', 'package.json', 'vite.config.ts', 'index.tsx', 'vercel.json'].map(file => (
                    <div key={file} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <span className="text-sm font-mono">{file}</span>
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    </div>
                  ))}
                </div>
             </div>
             <Globe className="absolute -bottom-10 -right-10 text-white/5" size={200} />
          </div>

          <button 
            onClick={() => window.open('https://vercel.com/dashboard', '_blank')}
            className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 group"
          >
            <Settings className="group-hover:rotate-90 transition-transform" />
            KE SETTING VERCEL
          </button>
        </div>
      </div>

      <div className="text-center py-12">
        <Rocket size={40} className="mx-auto text-slate-300 mb-4" />
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Sistem Digitalisasi Sekolah • v1.0</p>
      </div>
    </motion.div>
  );
};

export default AdminPanel;
