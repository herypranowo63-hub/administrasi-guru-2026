import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, FileText, Download, Search, Filter, BookCopy, AlertCircle } from 'lucide-react';
import { TeachingModule, Role } from '../types';
import { SUBJECTS, GRADES, SCHOOL_LOGO } from '../constants';

const ModulePage: React.FC<{ role: Role, username: string }> = ({ role, username }) => {
  const [modules, setModules] = useState<TeachingModule[]>([]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [selectedGrade, setSelectedGrade] = useState(GRADES[0]);
  const [selectedSemester, setSelectedSemester] = useState<'1' | '2'>('1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState<Partial<TeachingModule>>({
    topic: '',
    subject: SUBJECTS[0],
    grade: GRADES[0],
    semester: '1',
    meeting: '',
    allocation: 2
  });
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedModules = localStorage.getItem('spensa_modules');
    if (savedModules) {
      setModules(JSON.parse(savedModules));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadError('Hanya file PDF yang diperbolehkan.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setUploadError('Ukuran file maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setCurrentModule(prev => ({
        ...prev,
        fileName: file.name,
        fileSize: file.size,
        fileData: base64String
      }));
      setUploadError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!currentModule.topic || !currentModule.fileData) {
      setUploadError('Mohon lengkapi data dan upload file.');
      return;
    }

    const newModule: TeachingModule = {
      id: Date.now().toString(),
      teacherId: username,
      subject: currentModule.subject || selectedSubject,
      grade: currentModule.grade || selectedGrade,
      semester: currentModule.semester as '1' | '2' || selectedSemester,
      topic: currentModule.topic,
      meeting: currentModule.meeting,
      allocation: currentModule.allocation,
      fileName: currentModule.fileName!,
      fileSize: currentModule.fileSize!,
      fileData: currentModule.fileData!,
      uploadDate: new Date().toISOString()
    };

    const updatedModules = [...modules, newModule];
    setModules(updatedModules);
    localStorage.setItem('spensa_modules', JSON.stringify(updatedModules));
    setIsModalOpen(false);
    setCurrentModule({
      topic: '',
      subject: selectedSubject,
      grade: selectedGrade,
      semester: selectedSemester,
      meeting: '',
      allocation: 2
    });
    setUploadError('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus modul ajar ini?')) {
      const updated = modules.filter(m => m.id !== id);
      setModules(updated);
      localStorage.setItem('spensa_modules', JSON.stringify(updated));
    }
  };

  const handleDownload = (module: TeachingModule) => {
    const link = document.createElement('a');
    link.href = module.fileData;
    link.download = module.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredModules = modules.filter(m => {
    const matchesUser = role === 'ADMIN' ? true : m.teacherId === username;
    const matchesSubject = role === 'ADMIN' ? true : m.subject === selectedSubject;
    const matchesGrade = role === 'ADMIN' ? true : m.grade === selectedGrade;
    return matchesUser && 
           (role === 'ADMIN' ? true : (m.subject === selectedSubject && m.grade === selectedGrade));
  });

  // Group by Topic
  const groupedModules = filteredModules.reduce((acc, module) => {
    const topic = module.topic || 'Tanpa Topik';
    if (!acc[topic]) acc[topic] = [];
    acc[topic].push(module);
    return acc;
  }, {} as Record<string, TeachingModule[]>);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Modul Ajar</h1>
            <p className="text-slate-500 font-medium">Repository perangkat ajar digital (PDF) per Materi.</p>
          </div>
        </div>
        <div className="flex gap-2">
          {role !== 'ADMIN' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 bg-cyan-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-cyan-700 shadow-lg shadow-cyan-200 transition-all"
            >
              <Upload size={18} />
              Upload Modul
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {role !== 'ADMIN' && (
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
      )}

      {/* Module List Grouped by Topic */}
      <div className="space-y-8">
        {Object.entries(groupedModules).map(([topic, topicModules]) => (
          <div key={topic} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg">{topic}</h3>
              <span className="text-xs font-bold bg-white px-3 py-1 rounded-full text-slate-500 border border-slate-200">
                {topicModules.length} File
              </span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topicModules.map((module) => (
                <motion.div 
                  key={module.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md transition-all group relative"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500 shrink-0">
                      <FileText size={20} />
                    </div>
                    {role === 'ADMIN' && (
                      <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-full font-bold text-slate-500 ml-2">
                        {module.teacherId}
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                      Pertemuan {module.meeting || '-'} • {module.allocation || '-'} JP
                    </p>
                    <h4 className="font-bold text-slate-800 text-sm line-clamp-2" title={module.fileName}>
                      {module.fileName}
                    </h4>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <div className="text-[10px] text-slate-400 font-medium">
                      {(module.fileSize / 1024 / 1024).toFixed(2)} MB
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleDownload(module)}
                        className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </button>
                      {(role === 'ADMIN' || module.teacherId === username) && (
                        <button 
                          onClick={() => handleDelete(module.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
        
        {filteredModules.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed">
            <BookCopy size={32} className="mx-auto mb-2 opacity-50 text-slate-400" />
            <p className="text-sm font-bold text-slate-500">Belum ada modul ajar yang diupload.</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-4">Upload Modul Ajar</h2>
            
            {uploadError && (
              <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-sm font-medium rounded-xl flex items-center gap-2">
                <AlertCircle size={16} />
                {uploadError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Materi / Pokok Bahasan</label>
                <input 
                  type="text" 
                  value={currentModule.topic}
                  onChange={(e) => setCurrentModule({...currentModule, topic: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-cyan-500"
                  placeholder="Contoh: Bilangan Bulat"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pertemuan Ke-</label>
                  <input 
                    type="text" 
                    value={currentModule.meeting}
                    onChange={(e) => setCurrentModule({...currentModule, meeting: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-cyan-500"
                    placeholder="Contoh: 1-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Alokasi Waktu (JP)</label>
                  <input 
                    type="number" 
                    value={currentModule.allocation}
                    onChange={(e) => setCurrentModule({...currentModule, allocation: Number(e.target.value)})}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-cyan-500"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mata Pelajaran</label>
                  <select 
                    value={currentModule.subject}
                    onChange={(e) => setCurrentModule({...currentModule, subject: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-cyan-500"
                  >
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kelas</label>
                  <select 
                    value={currentModule.grade}
                    onChange={(e) => setCurrentModule({...currentModule, grade: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-cyan-500"
                  >
                    {GRADES.map(g => <option key={g} value={g}>Kelas {g}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">File PDF (Max 5MB)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="application/pdf"
                    className="hidden"
                  />
                  {currentModule.fileName ? (
                    <div className="flex items-center justify-center gap-2 text-cyan-600 font-bold">
                      <FileText size={20} />
                      {currentModule.fileName}
                    </div>
                  ) : (
                    <div className="text-slate-400">
                      <Upload size={24} className="mx-auto mb-2" />
                      <p className="text-sm font-medium">Klik untuk upload file PDF</p>
                    </div>
                  )}
                </div>
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
                className="flex-1 py-2.5 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 shadow-lg shadow-cyan-200 transition-all"
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

export default ModulePage;
