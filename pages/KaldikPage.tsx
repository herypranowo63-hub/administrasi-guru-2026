import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, List, Table, Download } from 'lucide-react';
import { KALDIK_EVENTS, EFFECTIVE_DAYS_GASAL, EFFECTIVE_DAYS_GENAP } from '../data/kaldikData';

const KaldikPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'effective'>('calendar');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Kalender Pendidikan</h1>
            <p className="text-slate-500 font-medium">Tahun Ajaran 2025/2026</p>
          </div>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'calendar' 
                ? 'bg-cyan-100 text-cyan-700' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <List size={18} />
            Agenda Kegiatan
          </button>
          <button
            onClick={() => setActiveTab('effective')}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'effective' 
                ? 'bg-cyan-100 text-cyan-700' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Table size={18} />
            Hari Efektif
          </button>
        </div>
      </div>

      {activeTab === 'calendar' ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase w-16 text-center">No</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase w-64">Tanggal / Bulan</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Uraian Kegiatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {KALDIK_EVENTS.map((event) => (
                  <tr key={event.no} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm font-bold text-slate-400 text-center">{event.no}</td>
                    <td className="p-4 text-sm font-bold text-slate-700">{event.date}</td>
                    <td className="p-4 text-sm text-slate-600">{event.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Semester Gasal */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-cyan-50 px-6 py-4 border-b border-cyan-100">
              <h3 className="font-bold text-cyan-800">Semester Gasal (Juli - Desember 2025)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-3 font-bold text-slate-600 border-r border-slate-100">Bulan</th>
                    <th className="p-3 font-bold text-slate-600 border-r border-slate-100">Hari Efektif</th>
                    <th className="p-3 font-bold text-slate-400 border-r border-slate-100">Awal Masuk</th>
                    <th className="p-3 font-bold text-slate-400 border-r border-slate-100">Asesmen</th>
                    <th className="p-3 font-bold text-slate-400 border-r border-slate-100">Upacara</th>
                    <th className="p-3 font-bold text-slate-400 border-r border-slate-100">Rapor</th>
                    <th className="p-3 font-bold text-rose-400 border-r border-slate-100">Libur Smt</th>
                    <th className="p-3 font-bold text-rose-400 border-r border-slate-100">Minggu</th>
                    <th className="p-3 font-bold text-rose-400 border-r border-slate-100">Libur Umum</th>
                    <th className="p-3 font-bold text-slate-800">Total Hari</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {EFFECTIVE_DAYS_GASAL.map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-700 text-left border-r border-slate-100">{row.month}</td>
                      <td className="p-3 font-bold text-cyan-700 bg-cyan-50/50 border-r border-slate-100">{row.effectiveDays}</td>
                      <td className="p-3 text-slate-500 border-r border-slate-100">{row.firstDay || '-'}</td>
                      <td className="p-3 text-slate-500 border-r border-slate-100">{row.assessment || '-'}</td>
                      <td className="p-3 text-slate-500 border-r border-slate-100">{row.ceremony || '-'}</td>
                      <td className="p-3 text-slate-500 border-r border-slate-100">{row.reportCard || '-'}</td>
                      <td className="p-3 text-rose-500 border-r border-slate-100">{row.semesterBreak || '-'}</td>
                      <td className="p-3 text-rose-500 border-r border-slate-100">{row.sunday || '-'}</td>
                      <td className="p-3 text-rose-500 border-r border-slate-100">{row.publicHoliday || '-'}</td>
                      <td className="p-3 font-bold text-slate-800">{row.totalHoliday}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold border-t-2 border-slate-100">
                    <td className="p-3 text-left border-r border-slate-200">JUMLAH</td>
                    <td className="p-3 text-cyan-700 border-r border-slate-200">137</td>
                    <td className="p-3 border-r border-slate-200">5</td>
                    <td className="p-3 border-r border-slate-200">4</td>
                    <td className="p-3 border-r border-slate-200">4</td>
                    <td className="p-3 border-r border-slate-200">1</td>
                    <td className="p-3 text-rose-600 border-r border-slate-200">7</td>
                    <td className="p-3 text-rose-600 border-r border-slate-200">24</td>
                    <td className="p-3 text-rose-600 border-r border-slate-200">3</td>
                    <td className="p-3 text-slate-900">171</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Semester Genap */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100">
              <h3 className="font-bold text-emerald-800">Semester Genap (Januari - Juli 2026)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-3 font-bold text-slate-600 border-r border-slate-100">Bulan</th>
                    <th className="p-3 font-bold text-slate-600 border-r border-slate-100">Hari Efektif</th>
                    <th className="p-3 font-bold text-slate-400 border-r border-slate-100">Upacara</th>
                    <th className="p-3 font-bold text-slate-400 border-r border-slate-100">Rapor</th>
                    <th className="p-3 font-bold text-rose-400 border-r border-slate-100">Libur Smt</th>
                    <th className="p-3 font-bold text-rose-400 border-r border-slate-100">Minggu</th>
                    <th className="p-3 font-bold text-rose-400 border-r border-slate-100">Libur Umum</th>
                    <th className="p-3 font-bold text-rose-400 border-r border-slate-100">Libur Agama</th>
                    <th className="p-3 font-bold text-slate-800">Total Hari</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {EFFECTIVE_DAYS_GENAP.map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-700 text-left border-r border-slate-100">{row.month}</td>
                      <td className="p-3 font-bold text-emerald-700 bg-emerald-50/50 border-r border-slate-100">{row.effectiveDays}</td>
                      <td className="p-3 text-slate-500 border-r border-slate-100">{row.ceremony || '-'}</td>
                      <td className="p-3 text-slate-500 border-r border-slate-100">{row.reportCard || '-'}</td>
                      <td className="p-3 text-rose-500 border-r border-slate-100">{row.semesterBreak || '-'}</td>
                      <td className="p-3 text-rose-500 border-r border-slate-100">{row.sunday || '-'}</td>
                      <td className="p-3 text-rose-500 border-r border-slate-100">{row.publicHoliday || '-'}</td>
                      <td className="p-3 text-rose-500 border-r border-slate-100">{row.religiousHoliday || '-'}</td>
                      <td className="p-3 font-bold text-slate-800">{row.totalHoliday}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold border-t-2 border-slate-100">
                    <td className="p-3 text-left border-r border-slate-200">JUMLAH</td>
                    <td className="p-3 text-emerald-700 border-r border-slate-200">123</td>
                    <td className="p-3 border-r border-slate-200">3</td>
                    <td className="p-3 border-r border-slate-200">1</td>
                    <td className="p-3 text-rose-600 border-r border-slate-200">20</td>
                    <td className="p-3 text-rose-600 border-r border-slate-200">27</td>
                    <td className="p-3 text-rose-600 border-r border-slate-200">13</td>
                    <td className="p-3 text-rose-600 border-r border-slate-200">10</td>
                    <td className="p-3 text-slate-900">193</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Total Hari Efektif 1 Tahun Ajaran</h3>
              <p className="text-slate-400">Tahun Ajaran 2025/2026</p>
            </div>
            <div className="text-4xl font-black text-cyan-400">260 Hari</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default KaldikPage;
