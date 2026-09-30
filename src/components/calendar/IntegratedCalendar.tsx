import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  getDaysInMonth, 
  getMonthName, 
  getTodayString, 
  formatDateReadable, 
  formatTime12, 
  getDayOfWeekName 
} from '../../utils/dateUtils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckSquare, Video, Clock, ListTodo } from 'lucide-react';

export const IntegratedCalendar: React.FC = () => {
  const { tasks, meetings, timetableEntries, todoLists, openModal, setEditingItem } = useApp();

  const todayStr = getTodayString();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-11
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

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

  const handleToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDate(todayStr);
  };

  // Filter events for selected date details
  const selectedDayTasks = tasks.filter(t => t.date === selectedDate);
  const selectedDayMeetings = meetings.filter(m => m.date === selectedDate && m.status !== 'Cancelled');
  const selectedDayOfWeek = getDayOfWeekName(selectedDate);
  const selectedDayTT = timetableEntries.filter(tt => {
    if (tt.recurring && tt.days && tt.days.includes(selectedDayOfWeek)) return true;
    if (tt.date === selectedDate) return true;
    return false;
  });

  return (
    <div className="space-y-6">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {getMonthName(currentMonth)} {currentYear}
            </h2>
            <p className="text-xs text-slate-400">Integrated monthly activity schedule</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold"
          >
            Today
          </button>
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
      </div>

      {/* Monthly Grid */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl p-4">
        {/* Days of week header */}
        <div className="grid grid-cols-7 text-center font-bold text-xs text-slate-400 border-b border-slate-800 pb-3 mb-2">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 min-h-[340px]">
          {/* Empty padding cells before 1st of month */}
          {Array.from({ length: daysMatrix[0]?.dayOfWeek || 0 }).map((_, idx) => (
            <div key={`empty-${idx}`} className="p-2 rounded-xl bg-slate-950/20 opacity-30" />
          ))}

          {daysMatrix.map((dayObj) => {
            const isToday = dayObj.dateString === todayStr;
            const isSelected = dayObj.dateString === selectedDate;

            // Events count for date
            const dTasks = tasks.filter(t => t.date === dayObj.dateString);
            const dMeetings = meetings.filter(m => m.date === dayObj.dateString && m.status !== 'Cancelled');
            const dDayName = getDayOfWeekName(dayObj.dateString);
            const dTT = timetableEntries.filter(tt => tt.recurring && tt.days?.includes(dDayName));

            const hasEvents = dTasks.length > 0 || dMeetings.length > 0 || dTT.length > 0;

            return (
              <button
                key={dayObj.dateString}
                onClick={() => setSelectedDate(dayObj.dateString)}
                className={`p-2 rounded-xl border flex flex-col justify-between items-start text-left min-h-[70px] transition-all relative ${
                  isSelected
                    ? 'bg-indigo-600/25 border-indigo-500 ring-2 ring-indigo-500/40'
                    : isToday
                    ? 'bg-slate-800 border-indigo-500/50'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-bold ${
                      isToday
                        ? 'px-1.5 py-0.5 rounded-full bg-indigo-600 text-white font-mono'
                        : isSelected
                        ? 'text-indigo-300 font-mono'
                        : 'text-slate-300 font-mono'
                    }`}
                  >
                    {dayObj.dayNumber}
                  </span>
                </div>

                {/* Event Indicators */}
                <div className="w-full space-y-1 mt-1">
                  {dTasks.length > 0 && (
                    <div className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span className="truncate">{dTasks.length} task{dTasks.length > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {dMeetings.length > 0 && (
                    <div className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-semibold truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      <span className="truncate">{dMeetings.length} meet</span>
                    </div>
                  )}
                  {dTT.length > 0 && (
                    <div className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span className="truncate">{dTT.length} routine</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Activity Inspector Panel (CRITICAL REQUIREMENT #21 & #40) */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>Activities for {formatDateReadable(selectedDate)}</span>
          </h3>

          <button
            onClick={() => {
              setEditingItem({ date: selectedDate });
              openModal('task');
            }}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
          >
            + Add Activity
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tasks Column */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              Tasks ({selectedDayTasks.length})
            </h4>
            {selectedDayTasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No tasks scheduled.</p>
            ) : (
              selectedDayTasks.map(t => (
                <div key={t.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs space-y-1">
                  <div className="font-bold text-slate-200">{t.title}</div>
                  <div className="text-[11px] font-mono text-indigo-300">
                    {formatTime12(t.startTime)} – {formatTime12(t.endTime)} ({t.priority})
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Meetings Column */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
              <Video className="w-4 h-4 text-sky-400" />
              Meetings ({selectedDayMeetings.length})
            </h4>
            {selectedDayMeetings.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No meetings scheduled.</p>
            ) : (
              selectedDayMeetings.map(m => (
                <div key={m.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs space-y-1">
                  <div className="font-bold text-slate-200">{m.title}</div>
                  <div className="text-[11px] font-mono text-sky-300">
                    {formatTime12(m.startTime)} – {formatTime12(m.endTime)} ({m.type})
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Timetable Routines Column */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              Timetable Blocks ({selectedDayTT.length})
            </h4>
            {selectedDayTT.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No routine blocks for this day.</p>
            ) : (
              selectedDayTT.map(tt => (
                <div key={tt.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs space-y-1">
                  <div className="font-bold text-slate-200">{tt.title}</div>
                  <div className="text-[11px] font-mono text-amber-300">
                    {formatTime12(tt.startTime)} – {formatTime12(tt.endTime)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
