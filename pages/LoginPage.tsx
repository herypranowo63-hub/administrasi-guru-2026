
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Info } from 'lucide-react';
import { SCHOOL_LOGO } from '../constants';

interface LoginPageProps {
  onLogin: (user: string, pass: string) => boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(username, password);
    if (!success) {
      setError('Kredensial tidak valid. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-50 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[100px] opacity-60"></div>

      <div className="w-full max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Portal Administrasi</h1>
          <p className="text-slate-500 font-medium">SMP Negeri 1 Kaligondang</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Username / Nama Lengkap</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-cyan-700 transition-all font-medium"
                  placeholder="Masukkan username"
                  required
                />
                <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-cyan-700 transition-all font-medium"
                  placeholder="Masukkan password"
                  required
                />
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2"
              >
                <Info size={14} />
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              className="w-full bg-cyan-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-cyan-800 active:scale-[0.98] transition-all shadow-lg shadow-cyan-100"
            >
              Masuk Sekarang
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              Aplikasi ini dikembangkan oleh <br/>
              <span className="text-cyan-700">Tim Kurikulum SMP N 1 Kaligondang</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
