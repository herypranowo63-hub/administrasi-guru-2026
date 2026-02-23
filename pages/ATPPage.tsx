import React, { useState, useEffect, useRef } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Plus, Trash2, Save, Download, Upload, ArrowDown, GripVertical, Info } from 'lucide-react';
import { TP, ATP } from '../types';
import { SUBJECTS, GRADES, SCHOOL_LOGO } from '../constants';
import { exportToExcel, importFromExcel } from '../utils/excelUtils';

const ATPPage: React.FC<{ username: string }> = ({ username }) => {
  const [atps, setAtps] = useState<ATP[]>([]);
  const [tps, setTps] = useState<TP[]>([]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [selectedGrade, setSelectedGrade] = useState(GRADES[0]);
  const [selectedSemester, setSelectedSemester] = useState<'1' | '2'>('1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTPId, setSelectedTPId] = useState('');
  const [allocation, setAllocation] = useState(2);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedTPs = localStorage.getItem('spensa_tps');
    if (savedTPs) setTps(JSON.parse(savedTPs));

    const savedATPs = localStorage.getItem('spensa_atps');
    if (savedATPs) setAtps(JSON.parse(savedATPs));
  }, []);

  const handleAddATP = () => {
    if (!selectedTPId) return;

    const newATP: ATP = {
      id: Date.now().toString(),
      teacherId: username,
      subject: selectedSubject,
      grade: selectedGrade,
      semester: selectedSemester,
      tpId: selectedTPId,
      order: atps.length + 1,
      allocation: allocation
    };

    const updatedATPs = [...atps, newATP];
    setAtps(updatedATPs);
    localStorage.setItem('spensa_atps', JSON.stringify(updatedATPs));
    setIsModalOpen(false);
    setSelectedTPId('');
    setAllocation(2);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus dari alur?')) {
      const updated = atps.filter(a => a.id !== id);
      setAtps(updated);
      localStorage.setItem('spensa_atps', JSON.stringify(updated));
    }
  };

  const handleReorder = (newOrder: ATP[]) => {
    // Update order property based on index
    const reordered = newOrder.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    // Merge with other ATPs not in this view
    const otherATPs = atps.filter(a => 
      !(a.teacherId === username &&
      a.subject === selectedSubject &&
      a.grade === selectedGrade &&
      a.semester === selectedSemester)
    );

    const finalATPs = [...otherATPs, ...reordered];
    setAtps(finalATPs);
    localStorage.setItem('spensa_atps', JSON.stringify(finalATPs));
  };

  const filteredATPs = atps.filter(a => 
    a.teacherId === username &&
    a.subject === selectedSubject &&
    a.grade === selectedGrade &&
    a.semester === selectedSemester
  ).sort((a, b) => a.order - b.order);

  const availableTPs = tps.filter(t => 
    t.teacherId === username &&
    t.subject === selectedSubject &&
    t.grade === selectedGrade &&
    !filteredATPs.some(a => a.tpId === t.id) // Filter out already added TPs
  );

  const getTPDetails = (tpId: string) => tps.find(t => t.id === tpId);

  const handleExport = () => {
    const data = filteredATPs.map((a, i) => {
      const tp = getTPDetails(a.tpId);
      return {
        "Urutan": i + 1,
        "Kode TP": tp?.code || '-',
        "Tujuan Pembelajaran": tp?.description || '-',
        "Alokasi Waktu (JP)": a.allocation
      };
    });
    exportToExcel(data, `ATP_${selectedSubject}_Kelas${selectedGrade}_Sem${selectedSemester}`);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const jsonData = await importFromExcel(file);
      // Logic to map import data back to ATP structure
      // Requires matching TP codes to IDs.
      const newATPs: ATP[] = [];
      let orderCounter = filteredATPs.length + 1;

      jsonData.forEach((row: any) => {
        const tpCode = row['Kode TP'] || row['Kode'];
        const tp = tps.find(t => t.code === tpCode && t.subject === selectedSubject && t.grade === selectedGrade);
        
        if (tp) {
          newATPs.push({
            id: `import-${Date.now()}-${Math.random()}`,
            teacherId: username,
            subject: selectedSubject,
            grade: selectedGrade,
            semester: selectedSemester,
            tpId: tp.id,
            order: orderCounter++,
            allocation: Number(row['Alokasi Waktu (JP)']) || 2
          });
        }
      });

      const merged = [...atps, ...newATPs];
      setAtps(merged);
      localStorage.setItem('spensa_atps', JSON.stringify(merged));
      alert(`${newATPs.length} data ATP berhasil di-import!`);
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
            <h1 className="text-2xl font-bold text-slate-900">Alur Tujuan Pembelajaran (ATP)</h1>
            <p className="text-slate-500 font-medium">Penyusunan urutan pembelajaran.</p>
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
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-violet-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-violet-700 shadow-lg shadow-violet-200 transition-all"
          >
            <Plus size={18} />
            Tambah ke Alur
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

      {/* Reorderable List */}
      <div className="space-y-4">
        <Reorder.Group axis="y" values={filteredATPs} onReorder={handleReorder} className="space-y-3">
          {filteredATPs.map((atp, index) => {
            const tp = getTPDetails(atp.tpId);
            return (
              <Reorder.Item key={atp.id} value={atp}>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                  <div className="text-slate-300">
                    <GripVertical size={20} />
                  </div>
                  <div className="w-8 h-8 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500">{tp?.code}</span>
                      <span className="text-xs font-bold text-slate-400 uppercase">{tp?.element}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800">{tp?.description}</p>
                  </div>
                  <div className="text-center px-4 border-l border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Alokasi</p>
                    <p className="text-sm font-bold text-violet-600">{atp.allocation} JP</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(atp.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                {index < filteredATPs.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown size={16} className="text-slate-200" />
                  </div>
                )}
              </Reorder.Item>
            );
          })}
        </Reorder.Group>

        {filteredATPs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed">
            <Info size={32} className="mx-auto mb-2 opacity-50 text-slate-400" />
            <p className="text-sm font-bold text-slate-500">Belum ada alur tujuan pembelajaran.</p>
            <p className="text-xs text-slate-400 mt-1">Tambahkan TP ke dalam alur ini.</p>
          </div>
        )}
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
              Pilih Tujuan Pembelajaran
            </h2>
            
            {availableTPs.length > 0 ? (
              <div className="space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                  {availableTPs.map(tp => (
                    <div 
                      key={tp.id}
                      onClick={() => setSelectedTPId(tp.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedTPId === tp.id 
                        ? 'bg-violet-50 border-violet-500 ring-1 ring-violet-500' 
                        : 'bg-white border-slate-200 hover:border-violet-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-xs text-slate-500">{tp.code}</span>
                        <span className="text-[10px] bg-slate-100 px-2 rounded text-slate-500">{tp.element}</span>
                      </div>
                      <p className="text-sm text-slate-800 line-clamp-2">{tp.description}</p>
                    </div>
                  ))}
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Alokasi Waktu (JP)</label>
                  <input 
                    type="number" 
                    value={allocation}
                    onChange={(e) => setAllocation(Number(e.target.value))}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-violet-500"
                    min="1"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleAddATP}
                    disabled={!selectedTPId}
                    className="flex-1 py-2.5 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 shadow-lg shadow-violet-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tambahkan
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 font-medium mb-4">Tidak ada TP yang tersedia untuk ditambahkan.</p>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm"
                >
                  Tutup
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ATPPage;
