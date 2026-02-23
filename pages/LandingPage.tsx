
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { SCHOOL_LOGO } from '../constants';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white overflow-hidden selection:bg-cyan-100 relative">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-50 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[100px] opacity-60"></div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="font-futuristic font-bold text-xl text-slate-900 tracking-tighter">SPENSAX DIGITAL</span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-cyan-700 transition-all duration-300"
        >
          Masuk Portal
        </button>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              Official Platform 2025/2026
            </span>
            <h1 className="text-6xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-8">
              ADMINISTRASI <br/>
              <span className="text-cyan-700">DIGITAL GURU</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
              Platform terpadu untuk pengelolaan data siswa, presensi, dan pelaporan administrasi SMP Negeri 1 Kaligondang yang futuristik dan efisien.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="group flex items-center gap-2 bg-cyan-700 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-cyan-800 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cyan-200"
              >
                Mulai Sekarang
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                Pelajari Fitur
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 bg-white p-4 rounded-[40px] shadow-2xl border border-slate-100 rotate-2">
              <img 
                src="https://picsum.photos/800/600?grayscale" 
                alt="Dashboard Preview" 
                className="rounded-[32px] w-full object-cover"
              />
              <div className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 -rotate-6 hidden sm:block">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <ShieldCheck />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">System Status</p>
                    <p className="text-sm font-bold text-slate-800">Secure & Active</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -left-10 bg-cyan-700 p-6 rounded-3xl shadow-xl rotate-3 hidden sm:block">
                <div className="flex items-center gap-4 text-white">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Zap />
                  </div>
                  <div>
                    <p className="text-xs text-white/60 font-bold uppercase">Performance</p>
                    <p className="text-sm font-bold">100% Digitalized</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          {[
            { icon: <Globe className="text-cyan-700" />, title: "Akses Fleksibel", desc: "Dapat diakses dari mana saja melalui perangkat apa saja dengan sinkronisasi otomatis." },
            { icon: <Zap className="text-amber-500" />, title: "Real-time Analytics", desc: "Dapatkan analisis statistik kehadiran dan progres jurnal secara instan." },
            { icon: <ShieldCheck className="text-emerald-500" />, title: "Keamanan Data", desc: "Data terproteksi dengan enkripsi terbaru untuk menjaga kerahasiaan administrasi sekolah." },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-100 bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-slate-400 font-medium">© 2025 SMP Negeri 1 Kaligondang. Built with precision for excellence.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
