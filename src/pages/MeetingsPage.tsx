import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MeetingCard } from '../components/meetings/MeetingCard';
import { EmptyState } from '../components/common/EmptyState';
import { getDaysInMonth, getMonthName, getTodayString, formatDateReadable } from '../utils/dateUtils';
import { Video, Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { Meeting } from '../types';

export const MeetingsPage: React.FC = () => {
  const { meetings, searchQuery, openModal, setEditingItem } = useApp();

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-11
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  // Filter meetings
  let filteredMeetings = meetings;

  if (selectedType !== 'all') {
    filteredMeetings = filteredMeetings.filter((m: Meeting) => m.type === selectedType);
  }

  if (selectedDate) {
    filteredMeetings = filteredMeetings.filter((m: Meeting) => m.date === selectedDate);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredMeetings = filteredMeetings.filter(
      (m: Meeting) =>
        m.title.toLowerCase().includes(q) ||
        m.contact.toLowerCase().includes(q) ||
        m.type.toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-sky-400" />
            <span>Meetings & Calls</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Schedule and track video calls, phone calls, and client meetings
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            openModal('meeting');
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs md:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Meeting / Call</span>
        </button>
      </div>

      {/* MAIN MONTHLY CALENDAR (Requirement #9) */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-400" />
            <span>
              {getMonthName(currentMonth)} {currentYear} Calendar
            </span>
          </h3>

          <div className="flex items-center gap-2">
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="px-2.5 py-1 text-xs text-indigo-300 bg-indigo-500/10 rounded-lg hover:bg-indigo-500/20"
              >
                Clear Date Filter ({formatDateReadable(selectedDate)})
              </button>
            )}
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

        {/* Calendar Grid */}
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
              <div key={`empty-${idx}`} className="p-2 rounded-xl bg-slate-950/20 opacity-30 min-h-[60px]" />
            ))}

            {daysMatrix.map((dayObj) => {
              const dayMeetings = meetings.filter(
                (m: Meeting) => m.date === dayObj.dateString && m.status !== 'Cancelled'
              );
              const isToday = dayObj.dateString === getTodayString();
              const isSelected = selectedDate === dayObj.dateString;

              return (
                <button
                  key={dayObj.dateString}
                  onClick={() =>
                    setSelectedDate(prev => (prev === dayObj.dateString ? null : dayObj.dateString))
                  }
                  className={`p-2 rounded-xl border text-left min-h-[65px] flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-400 ring-2 ring-sky-500/40'
                      : isToday
                      ? 'bg-slate-800 border-indigo-500/50'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60'
                  }`}
                >
                  <span className={`text-xs font-bold font-mono ${isToday ? 'text-indigo-400' : 'text-slate-300'}`}>
                    {dayObj.dayNumber}
                  </span>

                  {dayMeetings.length > 0 && (
                    <div className="w-full space-y-1 mt-1">
                      {dayMeetings.slice(0, 2).map((m: Meeting) => (
                        <div
                          key={m.id}
                          className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-semibold truncate flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                          <span className="truncate">{m.title}</span>
                        </div>
                      ))}
                      {dayMeetings.length > 2 && (
                        <span className="text-[9px] text-slate-400 font-bold block text-right">
                          +{dayMeetings.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MEETING LIST BELOW CALENDAR (Requirement #11 & #45) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-400" />
            <span>
              {selectedDate ? `Meetings for ${formatDateReadable(selectedDate)}` : 'Upcoming Meetings List'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
              {filteredMeetings.length}
            </span>
          </h3>

          {/* Filter by type */}
          <div className="flex items-center gap-2 text-xs bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Types</option>
              <option value="Video Call" className="bg-slate-900">Video Call</option>
              <option value="Phone Call" className="bg-slate-900">Phone Call</option>
              <option value="Meeting" className="bg-slate-900">In-Person Meeting</option>
              <option value="Other" className="bg-slate-900">Other</option>
            </select>
          </div>
        </div>

        {filteredMeetings.length === 0 ? (
          <EmptyState
            icon={Video}
            title="No Meetings Scheduled"
            description="Keep track of client syncs, phone calls, and group study meetings."
            actionLabel="+ Add Meeting"
            onAction={() => {
              setEditingItem(null);
              openModal('meeting');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMeetings.map((m: Meeting) => (
              <MeetingCard
                key={m.id}
                meeting={m}
                onSelect={() => {
                  setEditingItem(m);
                  openModal('meeting');
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
