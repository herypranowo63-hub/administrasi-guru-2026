
import React from 'react';
import { Bell, Search, GraduationCap } from 'lucide-react';
import { Role } from '../types';

interface NavbarProps {
  username: string;
  role: Role;
}

const Navbar: React.FC<NavbarProps> = ({ username, role }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-4">
        <GraduationCap className="text-blue-600" size={28} />
        <div>
          <h2 className="text-sm font-bold text-slate-800 hidden sm:block">SMP NEGERI 1 KALIGONDANG</h2>
          <p className="text-[10px] text-slate-500 font-medium hidden sm:block">Tahun Pelajaran 2025/2026</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <input 
            type="text" 
            placeholder="Search documents..." 
            className="w-64 pl-10 pr-4 py-2 bg-slate-50 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
        </div>
        
        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-none">{username}</p>
            <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-tighter">{role}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
            {username.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
