import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DailyTimeline } from '../components/timetable/DailyTimeline';
import { PredefinedTimetableModal } from '../components/timetable/PredefinedTimetableModal';
import { getDaysInMonth, getMonthName, getTodayString, formatDateReadable } from '../utils/dateUtils';
import { Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Settings, Plus } from 'lucide-react';

export const TimetablePage: React.FC = () => {
  const { tasks, meetings, timetableEntries, openModal, setEditingItem } = useApp();

  const todayStr = getTodayString();
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

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
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-400" />
            <span>Master Timetable Schedule</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            View daily hour-by-hour timelines, monthly schedules, and predefined recurring routines
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal('predefined')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
          >
            <Settings className="w-4 h-4 text-indigo-400" />
            <span>Predefined Routines</span>
          </button>

          <button
            onClick={() => {
              setEditingItem(null);
              openModal('timetable');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Block</span>
          </button>
        </div>
      </div>

      {/* View Selector Tabs [Daily] [Monthly] (Requirement #15) */}
      <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all ${
              activeTab === 'daily'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daily Timetable View
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all ${
              activeTab === 'monthly'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monthly Timetable View
          </button>
        </div>

        {/* Date Selector input for Daily view */}
        {activeTab === 'daily' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold hidden sm:inline">Select Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold"
            />
          </div>
        )}
      </div>

      {/* VIEW A: DAILY TIMETABLE (Requirement #16) */}
      {activeTab === 'daily' && (
        <DailyTimeline selectedDate={selectedDate} />
      )}

      {/* VIEW B: MONTHLY TIMETABLE (Requirement #17) */}
      {activeTab === 'monthly' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-400" />
                <span>
                  {getMonthName(currentMonth)} {currentYear} Timetable Matrix
                </span>
              </h3>

              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Grid */}
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
                  <div key={`empty-${idx}`} className="p-2 rounded-xl bg-slate-950/20 opacity-30 min-h-[65px]" />
                ))}

                {daysMatrix.map((dayObj) => {
                  const isSelected = selectedDate === dayObj.dateString;
                  const isToday = dayObj.dateString === todayStr;

                  return (
                    <button
                      key={dayObj.dateString}
                      onClick={() => {
                        setSelectedDate(dayObj.dateString);
                        setActiveTab('daily');
                      }}
                      className={`p-2.5 rounded-xl border text-left min-h-[65px] flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'bg-indigo-600/25 border-indigo-500 ring-2 ring-indigo-500/40'
                          : isToday
                          ? 'bg-slate-800 border-indigo-500/50'
                          : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60'
                      }`}
                    >
                      <span className={`text-xs font-bold font-mono ${isToday ? 'text-indigo-400' : 'text-slate-300'}`}>
                        {dayObj.dayNumber}
                      </span>
                      <span className="text-[10px] text-indigo-300 font-medium block mt-1">
                        View Schedule →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Predefined Routines Manager Modal */}
      <PredefinedTimetableModal />
    </div>
  );
};
