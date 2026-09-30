import React from 'react';
import { useApp } from '../../context/AppContext';
import { timeToMinutes, formatTime12, getDayOfWeekName } from '../../utils/dateUtils';
import { Clock, BookOpen, Video, Dumbbell, Award, Briefcase, Plus } from 'lucide-react';

interface DailyTimelineProps {
  selectedDate: string; // YYYY-MM-DD
}

export const DailyTimeline: React.FC<DailyTimelineProps> = ({ selectedDate }) => {
  const { tasks, meetings, timetableEntries, setEditingItem, openModal } = useApp();
  const dayOfWeek = getDayOfWeekName(selectedDate);

  // Collect all events for this date
  const dateTasks = tasks.filter(t => t.date === selectedDate);
  const dateMeetings = meetings.filter(m => m.date === selectedDate && m.status !== 'Cancelled');
  const dateTimetable = timetableEntries.filter(tt => {
    if (tt.recurring && tt.days && tt.days.includes(dayOfWeek)) return true;
    if (tt.date === selectedDate) return true;
    return false;
  });

  // Hours array from 05:00 to 23:00 (19 hour slots)
  const hours = Array.from({ length: 19 }, (_, i) => i + 5); // 5 to 23

  // Color mapping by event type
  const typeBadgeColors: Record<string, string> = {
    Task: 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300',
    Meeting: 'bg-sky-600/20 border-sky-500/40 text-sky-300',
    'Video Call': 'bg-sky-600/20 border-sky-500/40 text-sky-300',
    'Phone Call': 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300',
    College: 'bg-amber-600/20 border-amber-500/40 text-amber-300',
    Study: 'bg-violet-600/20 border-violet-500/40 text-violet-300',
    Workout: 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300',
    Personal: 'bg-pink-600/20 border-pink-500/40 text-pink-300',
    Other: 'bg-slate-600/20 border-slate-500/40 text-slate-300',
  };

  const typeIcons: Record<string, React.ReactNode> = {
    Task: <BookOpen className="w-3.5 h-3.5 text-indigo-400" />,
    Meeting: <Video className="w-3.5 h-3.5 text-sky-400" />,
    'Video Call': <Video className="w-3.5 h-3.5 text-sky-400" />,
    College: <Award className="w-3.5 h-3.5 text-amber-400" />,
    Study: <BookOpen className="w-3.5 h-3.5 text-violet-400" />,
    Workout: <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />,
    Personal: <Clock className="w-3.5 h-3.5 text-pink-400" />,
  };

  return (
    <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>Daily Schedule Timeline — {selectedDate} ({dayOfWeek})</span>
          </h3>
          <p className="text-xs text-slate-400">
            Unified view of tasks, meetings, and timetable blocks
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem({ date: selectedDate, startTime: '09:00', endTime: '10:00' });
            openModal('task');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shrink-0 shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {/* 24-Hour Timeline Grid */}
      <div className="relative border-l-2 border-indigo-500/30 pl-4 md:pl-8 space-y-4 my-2">
        {hours.map((hour) => {
          const hourStr = String(hour).padStart(2, '0') + ':00';
          const hourStartMins = hour * 60;
          const hourEndMins = (hour + 1) * 60;

          // Find events matching this hour block
          const matchingTasks = dateTasks.filter(t => {
            const s = timeToMinutes(t.startTime);
            return s >= hourStartMins && s < hourEndMins;
          });

          const matchingMeetings = dateMeetings.filter(m => {
            const s = timeToMinutes(m.startTime);
            return s >= hourStartMins && s < hourEndMins;
          });

          const matchingTT = dateTimetable.filter(tt => {
            const s = timeToMinutes(tt.startTime);
            return s >= hourStartMins && s < hourEndMins;
          });

          const hasEvents =
            matchingTasks.length > 0 || matchingMeetings.length > 0 || matchingTT.length > 0;

          return (
            <div key={hour} className="relative group">
              {/* Hour marker dot */}
              <div className="absolute -left-[21px] md:-left-[37px] top-1.5 w-3 h-3 rounded-full bg-slate-800 border-2 border-indigo-500 group-hover:scale-125 transition-transform" />

              <div className="flex flex-col md:flex-row md:items-start gap-2">
                {/* Hour Label */}
                <div className="w-16 shrink-0 font-mono text-xs font-bold text-slate-400">
                  {formatTime12(hourStr)}
                </div>

                {/* Event Cards Row */}
                <div className="flex-1 space-y-2">
                  {!hasEvents ? (
                    <div className="h-4 flex items-center">
                      <div className="w-full border-b border-slate-800/60 border-dashed" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {/* Tasks */}
                      {matchingTasks.map(t => (
                        <div
                          key={t.id}
                          className={`p-2.5 rounded-xl border text-xs space-y-1 shadow-md ${
                            typeBadgeColors['Task']
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span className="flex items-center gap-1.5 truncate">
                              {typeIcons['Task']}
                              <span className="truncate">{t.title}</span>
                            </span>
                            <span className="font-mono text-[10px] text-indigo-200">
                              {formatTime12(t.startTime)} – {formatTime12(t.endTime)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-400">
                            <span>Priority: {t.priority}</span>
                            <span>Progress: {t.progress}%</span>
                          </div>
                        </div>
                      ))}

                      {/* Meetings */}
                      {matchingMeetings.map(m => (
                        <div
                          key={m.id}
                          className={`p-2.5 rounded-xl border text-xs space-y-1 shadow-md ${
                            typeBadgeColors[m.type] || typeBadgeColors['Meeting']
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span className="flex items-center gap-1.5 truncate">
                              {typeIcons[m.type] || typeIcons['Meeting']}
                              <span className="truncate">{m.title}</span>
                            </span>
                            <span className="font-mono text-[10px] text-sky-200">
                              {formatTime12(m.startTime)} – {formatTime12(m.endTime)}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {m.contact} • {m.type}
                          </div>
                        </div>
                      ))}

                      {/* Timetable Blocks */}
                      {matchingTT.map(tt => (
                        <div
                          key={tt.id}
                          className={`p-2.5 rounded-xl border text-xs space-y-1 shadow-md ${
                            typeBadgeColors[tt.type] || typeBadgeColors['Other']
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span className="flex items-center gap-1.5 truncate">
                              {typeIcons[tt.type] || typeIcons['Personal']}
                              <span className="truncate">{tt.title}</span>
                            </span>
                            <span className="font-mono text-[10px] text-slate-300">
                              {formatTime12(tt.startTime)} – {formatTime12(tt.endTime)}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            Routine Block ({tt.type})
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
