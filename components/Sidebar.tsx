
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  UserCircle, 
  Clock, 
  FileText, 
  BookOpen, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { Role } from '../types';

interface SidebarProps {
  role: Role;
  username: string;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, username, onLogout }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Data Siswa', path: '/students', icon: <Users size={20} /> },
    { name: 'Presensi', path: '/attendance', icon: <CalendarCheck size={20} /> },
    { name: 'Biodata', path: '/biodata', icon: <UserCircle size={20} /> },
    { name: 'Jadwal Guru', path: '/schedule', icon: <Clock size={20} /> },
    { name: 'Rencana Harian', path: '/plans', icon: <FileText size={20} /> },
    { name: 'Jurnal Mengajar', path: '/journals', icon: <BookOpen size={20} /> },
  ];

  if (role === 'ADMIN') {
    menuItems.push({ name: 'Admin Panel', path: '/admin', icon: <ShieldCheck size={20} /> });
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
      <div className="p-6">
        <h1 className="text-blue-600 font-futuristic font-bold text-xl leading-tight">
          SPENSAX<br/><span className="text-slate-800 text-sm tracking-widest uppercase">Digital Admin</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
              ${isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}
            `}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-4 mb-4">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Signed in as</p>
          <p className="text-sm font-bold text-slate-800 truncate">{username}</p>
          <p className="text-xs font-medium text-blue-600">{role}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
