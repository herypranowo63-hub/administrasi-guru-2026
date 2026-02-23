import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, Download, Upload, Info } from 'lucide-react';
import { Prota } from '../types';
import { SUBJECTS, GRADES, SCHOOL_LOGO } from '../constants';
import { exportToExcel, importFromExcel } from '../utils/excelUtils';

const SEMESTER_1_MONTHS = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const SEMESTER_2_MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];

const PromesPage: React.FC<{ username: string }> = ({ username }) => {
  const [protas, setProtas] = useState<Prota[]>([]);
  const [distribution, setDistribution] = useState<Record<string, Record<string, number>>>({});
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [selectedGrade, setSelectedGrade] = useState(GRADES[0]);
  const [selectedSemester, setSelectedSemester] = useState<'1' | '2'>('1');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedProtas = localStorage.getItem('spensa_protas');
    if (savedProtas) setProtas(JSON.parse(savedProtas));

    const savedDist = localStorage.getItem('spensa_promes_dist');
    if (savedDist) setDistribution(JSON.parse(savedDist));
  }, []);

  const handleSave = () => {
    localStorage.setItem('spensa_promes_dist', JSON.stringify(distribution));
    alert('Program Semester berhasil disimpan!');
  };

  const handleDistributionChange = (protaId: string, monthIndex: number, weekIndex: number, value: string) => {
    const key = `${monthIndex}-${weekIndex}`;
    const val = parseInt(value) || 0;
    
    setDistribution(prev => ({
      ...prev,
      [protaId]: {
        ...(prev[protaId] || {}),
        [key]: val
      }
    }));
  };

  const filteredProtas = protas.filter(p => 
    p.teacherId === username &&
    p.subject === selectedSubject &&
    p.grade === selectedGrade &&
    p.semester === selectedSemester
  );

  const months = selectedSemester === '1' ? SEMESTER_1_MONTHS : SEMESTER_2_MONTHS;
  const monthOffset = selectedSemester === '1' ? 6 : 0; // July is 6th index (0-based) if Jan is 0? Actually Date.getMonth() returns 0 for Jan.
  // Let's just use 0-5 for display index relative to semester.

  const handleExport = () => {
    // Complex export for matrix
    const data = filteredProtas.map((p, i) => {
      const row: any = {
        "No": i + 1,
        "Materi Pokok": p.topic,
        "Alokasi (JP)": p.allocation,
      };
      
      months.forEach((m, mIdx) => {
        for (let w = 1; w <= 5; w++) {
          const key = `${mIdx}-${w}`;
          const val = distribution[p.id]?.[key] || '';
          row[`${m} M${w}`] = val;
        }
      });
      return row;
    });
    exportToExcel(data, `Promes_${selectedSubject}_Kelas${selectedGrade}_Sem${selectedSemester}`);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const jsonData = await importFromExcel(file);
      // We need to map back to distribution format
      // This is tricky because we need to match Prota IDs.
      // For simplicity, we'll try to match by Topic Name.
      
      const newDist = { ...distribution };
      let matchCount = 0;

      jsonData.forEach((row: any) => {
        const topic = row['Materi Pokok'];
        const prota = filteredProtas.find(p => p.topic === topic);
        
        if (prota) {
          matchCount++;
          if (!newDist[prota.id]) newDist[prota.id] = {};
          
          months.forEach((m, mIdx) => {
            for (let w = 1; w <= 5; w++) {
              const val = row[`${m} M${w}`];
              if (val !== undefined) {
                newDist[prota.id][`${mIdx}-${w}`] = Number(val) || 0;
              }
            }
          });
        }
      });

      setDistribution(newDist);
      localStorage.setItem('spensa_promes_dist', JSON.stringify(newDist));
      alert(`${matchCount} data distribusi berhasil di-update!`);
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
            <h1 className="text-2xl font-bold text-slate-900">Program Semester</h1>
            <p className="text-slate-500 font-medium">Distribusi alokasi waktu per pekan.</p>
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
            onClick={handleSave}
            className="px-6 py-2 bg-teal-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-teal-700 shadow-lg shadow-teal-200 transition-all"
          >
            <Save size={18} />
            Simpan Promes
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

      {/* Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th rowSpan={2} className="px-4 py-2 text-xs font-bold text-slate-500 uppercase w-12 text-center border-r border-slate-200 sticky left-0 bg-slate-50 z-10">No</th>
              <th rowSpan={2} className="px-4 py-2 text-xs font-bold text-slate-500 uppercase min-w-[200px] border-r border-slate-200 sticky left-12 bg-slate-50 z-10">Materi Pokok</th>
              <th rowSpan={2} className="px-2 py-2 text-xs font-bold text-slate-500 uppercase w-16 text-center border-r border-slate-200">JP</th>
              {months.map((m) => (
                <th key={m} colSpan={5} className="px-2 py-2 text-xs font-bold text-slate-700 uppercase text-center border-r border-slate-200 bg-cyan-50/50">
                  {m}
                </th>
              ))}
            </tr>
            <tr className="bg-slate-50 border-b border-slate-200">
              {months.map((m) => (
                [1, 2, 3, 4, 5].map(w => (
                  <th key={`${m}-${w}`} className="px-1 py-1 text-[10px] font-bold text-slate-400 text-center border-r border-slate-200 w-8">
                    {w}
                  </th>
                ))
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProtas.map((prota, idx) => (
              <tr key={prota.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-4 py-2 text-xs font-bold text-slate-500 text-center border-r border-slate-100 sticky left-0 bg-white z-10">{idx + 1}</td>
                <td className="px-4 py-2 text-xs font-medium text-slate-800 border-r border-slate-100 sticky left-12 bg-white z-10 truncate max-w-[200px]" title={prota.topic}>
                  {prota.topic}
                </td>
                <td className="px-2 py-2 text-xs font-bold text-cyan-700 text-center border-r border-slate-100 bg-slate-50/30">
                  {prota.allocation}
                </td>
                {months.map((m, mIdx) => (
                  [1, 2, 3, 4, 5].map(w => {
                    const key = `${mIdx}-${w}`;
                    const val = distribution[prota.id]?.[key] || '';
                    return (
                      <td key={`${prota.id}-${key}`} className="p-0 border-r border-slate-100">
                        <input 
                          type="text" 
                          value={val}
                          onChange={(e) => handleDistributionChange(prota.id, mIdx, w, e.target.value)}
                          className="w-full h-full min-h-[32px] text-center text-xs font-medium focus:bg-cyan-50 focus:outline-none transition-colors"
                        />
                      </td>
                    );
                  })
                ))}
              </tr>
            ))}
            {filteredProtas.length === 0 && (
              <tr>
                <td colSpan={3 + (months.length * 5)} className="px-6 py-12 text-center text-slate-400">
                  <Info size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold">Belum ada data materi. Silakan input di Program Tahunan terlebih dahulu.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default PromesPage;
