
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Briefcase, Hash, Layers, Save, Edit3 } from 'lucide-react';
import { Role } from '../types';

const BiodataPage: React.FC<{ role: Role, username: string }> = ({ role, username }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState({
    name: username,
    nip: '198505202010011005',
    pangkat: 'Penata Muda Tingkat I',
    golongan: 'III/b',
    jabatan: role === 'WALAS' ? 'Wali Kelas' : 'Guru Muda',
    mapel: 'Matematika',
    kelas: '7A, 7B, 7C',
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profil Saya</h1>
          <p className="text-slate-500 font-medium">Informasi biodata lengkap pendidik.</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
            isEditing 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {isEditing ? <><Save size={18} /> Simpan Profil</> : <><Edit3 size={18} /> Edit Biodata</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black border-4 border-white shadow-xl">
                {bio.name.charAt(0)}
              </div>
              <div className="absolute bottom-1 right-1 w-10 h-10 bg-emerald-500 border-4 border-white rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Shield size={20} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">{bio.name}</h2>
            <p className="text-sm font-bold text-blue-600 uppercase tracking-tighter">{role}</p>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">ID Card</p>
              <p className="font-futuristic text-lg tracking-widest mb-8">SPENSA-2025-001</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase">NIP</p>
                  <p className="font-bold text-sm">{bio.nip}</p>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full blur-sm"></div>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl"></div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { label: 'Nama Lengkap', value: bio.name, key: 'name', icon: <User size={20} className="text-blue-500" /> },
                { label: 'NIP', value: bio.nip, key: 'nip', icon: <Hash size={20} className="text-slate-400" /> },
                { label: 'Pangkat', value: bio.pangkat, key: 'pangkat', icon: <Briefcase size={20} className="text-amber-500" /> },
                { label: 'Golongan', value: bio.golongan, key: 'golongan', icon: <Layers size={20} className="text-emerald-500" /> },
                { label: 'Jabatan', value: bio.jabatan, key: 'jabatan', icon: <Shield size={20} className="text-indigo-500" /> },
                { label: 'Mata Pelajaran', value: bio.mapel, key: 'mapel', icon: <Edit3 size={20} className="text-rose-500" /> },
              ].map((field) => (
                <div key={field.key} className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    {field.icon}
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{field.label}</label>
                  </div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={field.value}
                      onChange={(e) => setBio({...bio, [field.key]: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-800">{field.value}</div>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-slate-50">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Kelas yang Diampu</label>
               <div className="flex flex-wrap gap-2">
                 {bio.kelas.split(',').map(c => (
                   <span key={c} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm">Kelas {c.trim()}</span>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BiodataPage;
