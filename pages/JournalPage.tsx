
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Edit3, Trash2, Save, X, Book, Printer, FileText } from 'lucide-react';
import { TeacherJournal } from '../types';
import { SUBJECTS, CLASSES } from '../constants';
import CalendarWidget from '../components/CalendarWidget';

const JournalPage: React.FC<{ role: string, username: string }> = ({ role, username }) => {
  const [journals, setJournals] = useState<TeacherJournal[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  
  // Data Kepala Sekolah & Guru untuk Tanda Tangan
  const [printConfig, setPrintConfig] = useState({
    principalName: 'Siti Nurhasanah, S.Pd., M.Pd.',
    principalNip: '19700101 199501 2 001',
    teacherName: username,
    teacherNip: '.........................',
    city: 'Kaligondang'
  });

  const [currentJournal, setCurrentJournal] = useState<Partial<TeacherJournal>>({
    date: new Date().toISOString().split('T')[0],
    period: '1-2',
    classId: CLASSES[0],
    subject: SUBJECTS[0],
    activities: { start: '', core: '', end: '', reflection: '', followUp: '' },
    attendance: '',
    notes: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('spensa_journals');
    if (saved) setJournals(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    // Include teacherName when saving
    const newJournals = [{ 
      ...currentJournal as TeacherJournal, 
      id: Date.now().toString(),
      teacherName: username 
    }, ...journals];
    
    setJournals(newJournals);
    localStorage.setItem('spensa_journals', JSON.stringify(newJournals));
    setIsFormOpen(false);
    
    // Reset Form
    setCurrentJournal({
      date: new Date().toISOString().split('T')[0],
      period: '1-2',
      classId: CLASSES[0],
      subject: SUBJECTS[0],
      activities: { start: '', core: '', end: '', reflection: '', followUp: '' },
      attendance: '',
      notes: ''
    });
  };

  const deleteJournal = (id: string) => {
    if(window.confirm('Hapus jurnal ini?')) {
      const filtered = journals.filter(j => j.id !== id);
      setJournals(filtered);
      localStorage.setItem('spensa_journals', JSON.stringify(filtered));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Jurnal Mengajar</h1>
          <p className="text-slate-500 font-medium">Laporan realisasi kegiatan pembelajaran harian.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsPrintModalOpen(true)}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Printer size={20} />
            Cetak Laporan
          </button>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <BookOpen size={20} />
            Buat Jurnal Baru
          </button>
        </div>
      </div>

      <CalendarWidget />

      <div className="space-y-6">
        {journals.length === 0 ? (
          <div className="p-32 bg-white border border-dashed border-slate-200 rounded-[3rem] text-center space-y-4">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
               <Book size={40} className="text-slate-200" />
             </div>
             <div className="max-w-xs mx-auto">
               <h3 className="text-lg font-bold text-slate-800">Jurnal Masih Kosong</h3>
               <p className="text-xs text-slate-400">Silakan catat kegiatan belajar mengajar Anda melalui tombol 'Buat Jurnal Baru'.</p>
             </div>
          </div>
        ) : (
          journals.map(j => (
            <motion.div key={j.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/4 space-y-4">
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tanggal & Kelas</p>
                      <p className="text-lg font-black text-slate-900">{j.date}</p>
                      <p className="text-xs font-bold text-indigo-600 uppercase">Jam {j.period} • {j.classId}</p>
                   </div>
                   <div className="bg-indigo-50 p-6 rounded-3xl">
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Absensi</p>
                      <p className="text-xs font-bold text-indigo-900 leading-relaxed">{j.attendance || 'Tidak dicatat'}</p>
                   </div>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      {['start', 'core', 'end'].map(key => (
                        <div key={key}>
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div> 
                             {key === 'start' ? 'Pendahuluan' : key === 'core' ? 'Kegiatan Inti' : 'Penutup'}
                          </h4>
                          <p className="text-xs text-slate-700 leading-relaxed">{(j.activities as any)[key] || '-'}</p>
                        </div>
                      ))}
                   </div>
                   <div className="space-y-4">
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <h4 className="text-[10px] font-black text-emerald-600 uppercase mb-1">Refleksi</h4>
                        <p className="text-xs text-emerald-900 italic">"{j.activities.reflection || '-'}"</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <h4 className="text-[10px] font-black text-blue-600 uppercase mb-1">Lanjut</h4>
                        <p className="text-xs text-blue-900 italic">"{j.activities.followUp || '-'}"</p>
                      </div>
                   </div>
                </div>
              </div>
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => deleteJournal(j.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* INPUT JOURNAL FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
           <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl p-10 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900">Input Jurnal</h2>
                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X /></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</label>
                   <input type="date" value={currentJournal.date} onChange={e => setCurrentJournal({...currentJournal, date: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-800" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kelas</label>
                   <select value={currentJournal.classId} onChange={e => setCurrentJournal({...currentJournal, classId: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-800">
                     {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mapel</label>
                   <select value={currentJournal.subject} onChange={e => setCurrentJournal({...currentJournal, subject: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-800">
                     {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Absensi</label>
                   <input type="text" placeholder="Contoh: 32H, 1S" value={currentJournal.attendance} onChange={e => setCurrentJournal({...currentJournal, attendance: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-800" />
                 </div>
              </div>

              <div className="space-y-6 mb-10">
                 {[{ l: 'Pendahuluan', k: 'start' }, { l: 'Kegiatan Inti', k: 'core' }, { l: 'Penutup', k: 'end' }, { l: 'Refleksi', k: 'reflection' }].map(area => (
                   <div key={area.k} className="space-y-2">
                     <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{area.l}</label>
                     <textarea 
                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-xs font-medium text-slate-800 h-20 resize-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder={`Tuliskan ${area.l.toLowerCase()}...`}
                        value={(currentJournal.activities as any)[area.k]}
                        onChange={e => setCurrentJournal({
                          ...currentJournal, 
                          activities: { ...currentJournal.activities!, [area.k]: e.target.value }
                        })}
                     ></textarea>
                   </div>
                 ))}
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setIsFormOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all">Batal</button>
                 <button onClick={handleSave} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl transition-all flex items-center justify-center gap-2">
                   <Save size={20} /> Simpan Jurnal
                 </button>
              </div>
           </motion.div>
        </div>
      )}

      {/* PRINT PREVIEW MODAL */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-5xl min-h-[90vh] my-8 rounded-xl shadow-2xl flex flex-col relative print:w-full print:h-full print:my-0 print:rounded-none print:shadow-none">
            
            {/* Control Bar (Hidden when Printing) */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl print:hidden sticky top-0 z-10">
              <div>
                <h3 className="font-bold text-slate-800">Pratinjau Cetak</h3>
                <p className="text-xs text-slate-500">Sesuaikan data tanda tangan sebelum mencetak.</p>
              </div>
              <div className="flex gap-3">
                 <button onClick={() => setIsPrintModalOpen(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold text-xs hover:bg-slate-300">Tutup</button>
                 <button onClick={handlePrint} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700 flex items-center gap-2">
                    <Printer size={16} /> Cetak Sekarang
                 </button>
              </div>
            </div>

            {/* Config Inputs (Hidden when Printing) */}
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-blue-50/50 border-b border-blue-100 print:hidden">
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Kota</label>
                  <input type="text" value={printConfig.city} onChange={e => setPrintConfig({...printConfig, city: e.target.value})} className="w-full text-xs font-bold bg-white border border-slate-200 rounded p-2" />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Kepala Sekolah</label>
                  <input type="text" value={printConfig.principalName} onChange={e => setPrintConfig({...printConfig, principalName: e.target.value})} className="w-full text-xs font-bold bg-white border border-slate-200 rounded p-2" />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">NIP Kepala Sekolah</label>
                  <input type="text" value={printConfig.principalNip} onChange={e => setPrintConfig({...printConfig, principalNip: e.target.value})} className="w-full text-xs font-bold bg-white border border-slate-200 rounded p-2" />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">NIP Guru</label>
                  <input type="text" value={printConfig.teacherNip} onChange={e => setPrintConfig({...printConfig, teacherNip: e.target.value})} className="w-full text-xs font-bold bg-white border border-slate-200 rounded p-2" />
               </div>
            </div>

            {/* Document Content */}
            <div className="p-10 md:p-16 flex-1 bg-white print:p-0 text-black">
               {/* Kop Surat Resmi */}
               <div className="flex items-center gap-4 border-b-4 border-double border-black pb-4 mb-8">
                  <div className="w-24 shrink-0 flex justify-center">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Lambang_Kabupaten_Purbalingga.png" 
                      alt="Logo" 
                      className="w-20 h-auto grayscale print:grayscale-0"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                  </div>
                  <div className="flex-1 text-center">
                     <h3 className="text-base font-bold uppercase tracking-wide font-serif">PEMERINTAH KABUPATEN PURBALINGGA</h3>
                     <h3 className="text-base font-bold uppercase tracking-wide font-serif">DINAS PENDIDIKAN DAN KEBUDAYAAN</h3>
                     <h1 className="text-3xl font-black uppercase tracking-widest my-1 font-serif">SMP NEGERI 1 KALIGONDANG</h1>
                     <p className="text-sm font-serif italic">Jalan Raya Kaligondang, Kaligondang, Purbalingga, Jawa Tengah 53391</p>
                  </div>
               </div>

               <h2 className="text-center font-bold text-lg underline uppercase mb-8">JURNAL KEGIATAN GURU</h2>

               <table className="w-full border-collapse border border-black mb-8">
                  <thead>
                    <tr className="bg-slate-100 print:bg-gray-100">
                      <th className="border border-black px-2 py-2 text-xs font-bold text-center w-10">No</th>
                      <th className="border border-black px-2 py-2 text-xs font-bold text-center w-24">Hari/Tgl</th>
                      <th className="border border-black px-2 py-2 text-xs font-bold text-center w-16">Kelas</th>
                      <th className="border border-black px-2 py-2 text-xs font-bold text-center w-16">Jam</th>
                      <th className="border border-black px-2 py-2 text-xs font-bold text-center">Materi / Kegiatan</th>
                      <th className="border border-black px-2 py-2 text-xs font-bold text-center w-20">Absensi</th>
                      <th className="border border-black px-2 py-2 text-xs font-bold text-center w-24">Ket</th>
                    </tr>
                  </thead>
                  <tbody>
                    {journals.map((j, idx) => (
                      <tr key={j.id}>
                        <td className="border border-black px-2 py-2 text-xs text-center">{idx + 1}</td>
                        <td className="border border-black px-2 py-2 text-xs text-center">{j.date}</td>
                        <td className="border border-black px-2 py-2 text-xs text-center">{j.classId}</td>
                        <td className="border border-black px-2 py-2 text-xs text-center">{j.period}</td>
                        <td className="border border-black px-2 py-2 text-xs">
                           <div className="font-bold mb-1">{j.subject}</div>
                           <ul className="list-disc pl-3 text-[10px] space-y-0.5">
                             <li><span className="font-bold">Inti:</span> {j.activities.core}</li>
                             {j.activities.followUp && <li><span className="font-bold">TL:</span> {j.activities.followUp}</li>}
                           </ul>
                        </td>
                        <td className="border border-black px-2 py-2 text-xs text-center">{j.attendance || '-'}</td>
                        <td className="border border-black px-2 py-2 text-xs text-center"></td>
                      </tr>
                    ))}
                    {journals.length === 0 && (
                      <tr>
                        <td colSpan={7} className="border border-black px-4 py-8 text-center text-sm italic">Data jurnal masih kosong.</td>
                      </tr>
                    )}
                  </tbody>
               </table>

               {/* SIGNATURE BLOCK */}
               <div className="flex justify-between mt-12 break-inside-avoid">
                  <div className="text-center w-64">
                    <p className="text-sm font-serif">Mengetahui,</p>
                    <p className="text-sm font-bold font-serif">Kepala Sekolah</p>
                    <br /><br /><br /><br />
                    <p className="text-sm font-bold underline uppercase font-serif">{printConfig.principalName}</p>
                    <p className="text-sm font-serif">NIP. {printConfig.principalNip}</p>
                  </div>

                  <div className="text-center w-64">
                    <p className="text-sm font-serif">{printConfig.city}, {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                    <p className="text-sm font-bold font-serif">Guru Mata Pelajaran</p>
                    <br /><br /><br /><br />
                    <p className="text-sm font-bold underline uppercase font-serif">{printConfig.teacherName}</p>
                    <p className="text-sm font-serif">NIP. {printConfig.teacherNip}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default JournalPage;
