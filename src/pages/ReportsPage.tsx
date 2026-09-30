import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DateReportModal } from '../components/reports/DateReportModal';
import { ReportCharts } from '../components/reports/ReportCharts';
import { getDaysInMonth, getMonthName, getTodayString } from '../utils/dateUtils';
import { BarChart3, Calendar as CalendarIcon, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { Task } from '../types';

export const ReportsPage: React.FC = () => {
  const { tasks } = useApp();

  const todayStr = getTodayString();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-11
  const [inspectedDate, setInspectedDate] = useState<string | null>(null);

  const daysMatrix = getDaysInMonth(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            <span>Productivity & Reports</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any date in the monthly calendar to inspect detailed task completion stats
          </p>
        </div>

        {/* Month Selector Controls */}
        <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700 shrink-0">
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-extrabold text-xs md:text-sm text-white px-2">
            {getMonthName(currentMonth)} {currentYear}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MONTHLY CALENDAR PROGRESS MATRIX (Requirement #12) */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-indigo-400" />
          <span>Monthly Task Completion Progress</span>
        </h3>

        <div className="space-y-2">
          <div className="grid grid-cols-7 text-center font-bold text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: daysMatrix[0]?.dayOfWeek || 0 }).map((_, idx) => (
              <div key={`empty-${idx}`} className="p-2 rounded-xl bg-slate-950/20 opacity-30 min-h-[70px]" />
            ))}

            {daysMatrix.map((dayObj) => {
              const dateTasks = tasks.filter((t: Task) => t.date === dayObj.dateString);
              const total = dateTasks.length;
              const completed = dateTasks.filter((t: Task) => t.progress >= 100).length;
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
              const isToday = dayObj.dateString === todayStr;

              return (
                <button
                  key={dayObj.dateString}
                  onClick={() => setInspectedDate(dayObj.dateString)}
                  className={`p-2.5 rounded-xl border text-left min-h-[75px] flex flex-col justify-between transition-all hover:border-indigo-500/60 group ${
                    isToday
                      ? 'bg-slate-800 border-indigo-500/60'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-bold font-mono ${isToday ? 'text-indigo-400' : 'text-slate-300'}`}>
                      {dayObj.dayNumber}
                    </span>
                    {total > 0 && (
                      <span className="text-[10px] font-mono font-extrabold text-indigo-300">
                        {pct}%
                      </span>
                    )}
                  </div>

                  {total > 0 ? (
                    <div className="w-full space-y-1 mt-1">
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-400 font-semibold block">
                        {completed}/{total} done
                      </span>
                    </div>
                  ) : (
                    <span className="text-[9px] text-slate-600 block">No tasks</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MONTHLY STATS & CHARTS (Requirement #14) */}
      <ReportCharts selectedYear={currentYear} selectedMonth={currentMonth} />

      {/* Date Inspection Modal Drawer (Requirement #13) */}
      <DateReportModal
        dateStr={inspectedDate}
        onClose={() => setInspectedDate(null)}
      />
    </div>
  );
};
