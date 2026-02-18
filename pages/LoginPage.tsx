
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Info } from 'lucide-react';

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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2rem] text-white shadow-2xl shadow-blue-200 mb-6">
            <User size={36} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Portal Administrasi</h1>
          <p className="text-slate-500">Silakan masuk untuk mengakses data Anda</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-100/50"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Username / Nama Lengkap</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-medium"
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
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-medium"
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
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-100"
            >
              Masuk Sekarang
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              Aplikasi ini dikembangkan oleh <br/>
              <span className="text-blue-600">Tim Kurikulum SMP N 1 Kaligondang</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
