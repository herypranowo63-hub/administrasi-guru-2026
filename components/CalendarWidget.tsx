
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Eye, EyeOff } from 'lucide-react';
import { MONTHS } from '../constants';

const CalendarWidget: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth());
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const startDay = new Date(activeYear, activeMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (activeMonth === 0) {
      setActiveMonth(11); setActiveYear(activeYear - 1);
    } else { setActiveMonth(activeMonth - 1); }
  };

  const handleNextMonth = () => {
    if (activeMonth === 11) {
      setActiveMonth(0); setActiveYear(activeYear + 1);
    } else { setActiveMonth(activeMonth + 1); }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-6">
       <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="w-full flex items-center justify-between text-sm font-bold text-slate-700 hover:text-teal-600 transition-colors"
      >
        <span className="flex items-center gap-2">
          <CalendarIcon size={18} className="text-teal-600" />
          {showCalendar ? 'Tutup Kalender' : 'Buka Kalender'}
        </span>
        {showCalendar ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>

      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-left">
                <h3 className="font-bold text-slate-800">{MONTHS[activeMonth]}</h3>
                <p className="text-[10px] font-black text-teal-600 uppercase">{activeYear}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={handlePrevMonth} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronLeft size={16} /></button>
                <button onClick={handleNextMonth} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronRight size={16} /></button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['M','S','S','R','K','J','S'].map(d => (
                <span key={d} className="text-[10px] font-bold text-slate-400">{d}</span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({length: startDay}).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({length: daysInMonth(activeMonth, activeYear)}, (_, i) => {
                const day = i + 1;
                const isToday = new Date().getDate() === day && new Date().getMonth() === activeMonth && new Date().getFullYear() === activeYear;
                return (
                  <div key={day} className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${isToday ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
                    {day}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarWidget;
