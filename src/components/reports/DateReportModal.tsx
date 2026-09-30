import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { formatDateReadable, formatTime12 } from '../../utils/dateUtils';
import { CheckCircle2, Clock, Calendar, AlertCircle } from 'lucide-react';

interface DateReportModalProps {
  dateStr: string | null;
  onClose: () => void;
}

export const DateReportModal: React.FC<DateReportModalProps> = ({ dateStr, onClose }) => {
  const { tasks } = useApp();

  if (!dateStr) return null;

  const dateTasks = tasks.filter(t => t.date === dateStr);
  const totalTasks = dateTasks.length;
  const completedTasks = dateTasks.filter(t => t.progress >= 100).length;
  const remainingTasks = totalTasks - completedTasks;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Modal
      isOpen={Boolean(dateStr)}
      onClose={onClose}
      title={`Daily Report — ${formatDateReadable(dateStr)}`}
      subtitle="Detailed breakdown of tasks scheduled for this date"
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Statistics Summary */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Total Tasks</span>
            <span className="text-xl font-extrabold text-white">{totalTasks}</span>
          </div>
          <div>
            <span className="text-[11px] text-emerald-400 font-medium block">Completed</span>
            <span className="text-xl font-extrabold text-emerald-400">{completedTasks}</span>
          </div>
          <div>
            <span className="text-[11px] text-amber-400 font-medium block">Remaining</span>
            <span className="text-xl font-extrabold text-amber-400">{remainingTasks}</span>
          </div>
        </div>

        {/* Daily Progress Bar */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-300">Daily Completion Progress</span>
            <span className="font-mono text-indigo-400 font-bold text-sm">{progressPct}%</span>
          </div>

          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Tasks List for Date */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Tasks Breakdown ({totalTasks})
          </h4>

          {totalTasks === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-800/30 rounded-xl border border-slate-800">
              No task data available for this date.
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {dateTasks.map(t => {
                const isDone = t.progress >= 100;
                return (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          className={`w-4 h-4 ${isDone ? 'text-emerald-400' : 'text-slate-500'}`}
                        />
                        <span
                          className={`font-bold ${
                            isDone ? 'line-through text-slate-400' : 'text-slate-100'
                          }`}
                        >
                          {t.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-indigo-300">
                          {formatTime12(t.startTime)} – {formatTime12(t.endTime)}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-bold">
                          {t.priority}
                        </span>
                      </div>
                    </div>

                    {/* Progress slider / bar */}
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${isDone ? 'bg-emerald-400' : 'bg-indigo-500'}`}
                          style={{ width: `${t.progress}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-400 text-[11px]">
                        {t.progress}% ({t.status})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
          >
            Close Report
          </button>
        </div>
      </div>
    </Modal>
  );
};
