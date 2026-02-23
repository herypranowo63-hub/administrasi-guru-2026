
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, Save, Calendar, Info, Download, Upload } from 'lucide-react';
import { DAYS, PERIODS, SUBJECTS, SCHOOL_LOGO } from '../constants';
import CalendarWidget from '../components/CalendarWidget';
import { exportToExcel, importFromExcel } from '../utils/excelUtils';

const SchedulePage: React.FC<{ role: string, username: string }> = ({ username }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [scheduleData, setScheduleData] = useState<Record<string, Record<number, string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`spensa_schedule_${username}`);
    if (saved) setScheduleData(JSON.parse(saved));
  }, [username]);

  const handleUpdate = (day: string, period: number, value: string) => {
    const updated = {
      ...scheduleData,
      [day]: {
        ...(scheduleData[day] || {}),
        [period]: value
      }
    };
    setScheduleData(updated);
  };

  const saveSchedule = () => {
    localStorage.setItem(`spensa_schedule_${username}`, JSON.stringify(scheduleData));
    setIsEditing(false);
  };

  const handleExport = () => {
    const exportData: any[] = [];
    Object.entries(scheduleData).forEach(([day, periods]) => {
      Object.entries(periods).forEach(([period, subject]) => {
        if (subject) {
          exportData.push({
            "Hari": day,
            "Jam Ke": parseInt(period),
            "Mapel": subject
          });
        }
      });
    });
    exportToExcel(exportData, "Jadwal_Mengajar_SPENSAX");
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const jsonData = await importFromExcel(file);
      const newSchedule: Record<string, Record<number, string>> = {};
      
      jsonData.forEach((row: any) => {
        const day = row['Hari'];
        const period = row['Jam Ke'];
        const subject = row['Mapel'];
        
        if (day && period && subject) {
          if (!newSchedule[day]) newSchedule[day] = {};
          newSchedule[day][period] = subject;
        }
      });

      setScheduleData(newSchedule);
      localStorage.setItem(`spensa_schedule_${username}`, JSON.stringify(newSchedule));
      alert('Jadwal berhasil di-import!');
    } catch (err) {
      console.error(err);
      alert('Gagal import jadwal.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const hasData = Object.keys(scheduleData).length > 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Jadwal Mengajar</h1>
            <p className="text-slate-500 font-medium">Pengaturan jam pelajaran mingguan 2025/2026.</p>
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
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all"
          >
            <Upload size={18} className="text-cyan-700" />
            Import
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all"
          >
            <Download size={18} className="text-slate-600" />
            Export
          </button>
           <button 
            onClick={() => isEditing ? saveSchedule() : setIsEditing(true)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              isEditing ? 'bg-emerald-600 text-white shadow-lg' : 'bg-teal-600 text-white shadow-lg shadow-teal-200'
            }`}
          >
            {isEditing ? <><Save size={18} /> Simpan Jadwal</> : <><Plus size={18} /> {hasData ? 'Edit Jadwal' : 'Input Jadwal'}</>}
          </button>
        </div>
      </div>

      <CalendarWidget />

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-6 py-6 font-futuristic text-xs tracking-widest uppercase border-r border-white/10">Jam Ke-</th>
                {DAYS.map(day => (
                  <th key={day} className="px-6 py-6 font-futuristic text-xs tracking-widest uppercase text-center border-r border-white/10">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PERIODS.map(period => (
                <tr key={period} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-6 bg-slate-50 border-r border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center font-black text-sm">{period}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{period === 1 ? '07:30' : '40 mnt'}</div>
                    </div>
                  </td>
                  {DAYS.map(day => (
                    <td key={`${day}-${period}`} className="px-4 py-4 text-center border-r border-slate-100 min-w-[140px]">
                      {isEditing ? (
                        <select 
                          className="w-full bg-slate-50 border-none rounded-xl px-3 py-2 text-[10px] font-bold text-slate-700"
                          value={scheduleData[day]?.[period] || ''}
                          onChange={(e) => handleUpdate(day, period, e.target.value)}
                        >
                          <option value="">- Kosong -</option>
                          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <div className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                          scheduleData[day]?.[period] 
                          ? 'bg-teal-50 text-teal-700 shadow-sm' 
                          : 'text-slate-100 italic font-medium lowercase'
                        }`}>
                          {scheduleData[day]?.[period] || 'kosong'}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!hasData && !isEditing && (
        <div className="p-8 bg-teal-50 rounded-[2rem] border border-dashed border-teal-200 flex items-center gap-4 text-teal-600">
           <Info size={24} />
           <p className="text-sm font-bold">Jadwal Anda masih kosong. Silakan klik tombol <span className="underline">Input Jadwal</span> untuk memulai.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
        <div className="p-8 bg-teal-600 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
          <Calendar className="mb-4 opacity-30" size={32} />
          <h3 className="text-xl font-bold mb-2">Total Jam</h3>
          <p className="text-4xl font-black">0 JP</p>
        </div>
        <div className="p-8 bg-indigo-600 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
          <Clock className="mb-4 opacity-30" size={32} />
          <h3 className="text-xl font-bold mb-2">Hari Sibuk</h3>
          <p className="text-4xl font-black">-</p>
        </div>
        <div className="p-8 bg-slate-900 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
          <Plus className="mb-4 opacity-30" size={32} />
          <h3 className="text-xl font-bold mb-2">Kesiapan Jurnal</h3>
          <p className="text-4xl font-black">0%</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SchedulePage;
