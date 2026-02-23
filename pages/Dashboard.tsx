
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  FileCheck,
  Search,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Role } from '../types';
import { CLASSES, SUBJECTS } from '../constants';
import CalendarWidget from '../components/CalendarWidget';

interface DashboardProps {
  username: string;
  role: Role;
}

const Dashboard: React.FC<DashboardProps> = ({ username, role }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    attendanceToday: '0%',
    journalsToday: 0,
    activePlans: 0
  });

  useEffect(() => {
    const students = JSON.parse(localStorage.getItem('spensa_students') || '[]');
    const journals = JSON.parse(localStorage.getItem('spensa_journals') || '[]');
    const plans = JSON.parse(localStorage.getItem('spensa_plans') || '[]');
    
    setStats({
      totalStudents: students.length,
      attendanceToday: '0%',
      journalsToday: journals.length,
      activePlans: plans.length
    });
  }, []);

  const attendanceChartData = CLASSES.slice(0, 9).map(c => ({
    name: c,
    attendance: 0,
    color: '#0e7490'
  }));

  const statCards = [
    { label: 'Total Siswa', value: stats.totalStudents, icon: <Users size={24} />, color: 'bg-cyan-600', trend: 'Data Terinput' },
    { label: 'Presensi Hari Ini', value: stats.attendanceToday, icon: <Calendar size={24} />, color: 'bg-emerald-500', trend: 'Belum Ada Data' },
    { label: 'Jurnal Selesai', value: stats.journalsToday, icon: <BookOpen size={24} />, color: 'bg-amber-500', trend: 'Total Input' },
    { label: 'Rencana Harian', value: stats.activePlans, icon: <FileCheck size={24} />, color: 'bg-purple-500', trend: 'Aktif' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Halo, {username}!</h1>
          <p className="text-slate-500 font-medium">Rekapitulasi administrasi digital SMP N 1 Kaligondang.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-cyan-50 border border-cyan-100 rounded-xl text-xs font-bold text-cyan-800 flex items-center gap-2">
            <Clock size={16} />
            Durasi: 40 Menit / JP
          </div>
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2">
            <Calendar size={16} className="text-cyan-700" />
            {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      <CalendarWidget />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-10 rounded-bl-full`}></div>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase tracking-widest">
                {stat.trend}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Analisis Kehadiran</h3>
              <p className="text-sm text-slate-500 font-medium">Progress harian per kelas (7A-7I)</p>
            </div>
            <TrendingUp className="text-cyan-700" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} dy={10} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="attendance" radius={[6, 6, 6, 6]} barSize={32} fill="#0e7490" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Aktivitas Terkini</h3>
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-10 opacity-20">
               <BookOpen size={48} className="text-slate-400 mb-4" />
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Belum ada aktivitas <br/> tercatat hari ini</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Ringkasan Per Kelas & Mapel</h3>
            <p className="text-sm text-slate-500 font-medium">Status administrasi harian (Durasi: 40 mnt/JP).</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <input type="text" placeholder="Cari Kelas..." className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-cyan-600" />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-50">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-6 py-4 font-futuristic text-[10px] tracking-widest uppercase border-r border-white/5">Kelas</th>
                {SUBJECTS.slice(0, 6).map(sub => (
                  <th key={sub} className="px-4 py-4 font-futuristic text-[9px] tracking-widest uppercase text-center border-r border-white/5 min-w-[100px]">{sub}</th>
                ))}
                <th className="px-4 py-4 font-futuristic text-[9px] tracking-widest uppercase text-center">BK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CLASSES.map(cls => (
                <tr key={cls} className="hover:bg-cyan-50/30 transition-colors">
                  <td className="px-6 py-4 font-black text-slate-700 bg-slate-50/50 border-r border-slate-100">{cls}</td>
                  {SUBJECTS.slice(0, 6).map(sub => (
                    <td key={`${cls}-${sub}`} className="px-4 py-4 text-center border-r border-slate-100">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                        <span className="text-[8px] font-bold text-slate-300 uppercase">No Data</span>
                      </div>
                    </td>
                  ))}
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                      <span className="text-[8px] font-bold text-slate-300 uppercase">No Data</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
