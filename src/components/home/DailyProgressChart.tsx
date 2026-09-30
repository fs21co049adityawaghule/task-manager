import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, TrendingUp, CheckCircle } from 'lucide-react';
import { getTodayString } from '../../utils/dateUtils';

export const DailyProgressChart: React.FC = () => {
  const { tasks } = useApp();
  const todayStr = getTodayString();

  const todayTasks = tasks.filter(t => t.date === todayStr);

  const completedCount = todayTasks.filter(t => t.progress >= 100).length;
  const avgProgress =
    todayTasks.length > 0
      ? Math.round(todayTasks.reduce((acc, t) => acc + (t.progress || 0), 0) / todayTasks.length)
      : 0;

  return (
    <section className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 my-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <span>Daily Progress Chart</span>
          </h3>
          <p className="text-xs text-slate-400">
            Real-time completion percentage breakdown across today's tasks
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span>Avg Progress:</span>
            <span className="text-indigo-300 font-mono font-bold">{avgProgress}%</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Completed:</span>
            <span className="text-emerald-300 font-mono font-bold">
              {completedCount} / {todayTasks.length}
            </span>
          </div>
        </div>
      </div>

      {todayTasks.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs bg-slate-800/30 rounded-xl">
          No tasks available for today to display in the progress chart.
        </div>
      ) : (
        <div className="space-y-3">
          {/* Chart Canvas Container */}
          <div className="w-full bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 overflow-x-auto">
            {/* Grid & Y-Axis Labels */}
            <div className="relative min-w-[500px] h-56 pt-6 pb-8 pl-12 pr-4 flex flex-col justify-between">
              {/* Y-Axis Guidelines */}
              {[100, 80, 60, 40, 20, 0].map((val) => (
                <div key={val} className="absolute left-0 right-0 flex items-center" style={{ bottom: `${(val / 100) * 75 + 12}%` }}>
                  <span className="w-10 text-[10px] font-mono font-semibold text-slate-500 text-right pr-2">
                    {val}%
                  </span>
                  <div className="flex-1 border-b border-slate-800/80 border-dashed" />
                </div>
              ))}

              {/* Bars Columns */}
              <div className="relative z-10 flex items-end justify-around h-full pt-4">
                {todayTasks.map((task) => {
                  const isDone = task.progress >= 100;
                  const barHeightPct = Math.max(4, task.progress);

                  return (
                    <div
                      key={task.id}
                      className="flex flex-col items-center flex-1 max-w-[80px] h-full justify-end group px-1"
                    >
                      {/* Hover Tooltip / Value badge */}
                      <div className="opacity-90 group-hover:opacity-100 transition-opacity mb-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700 shadow-md">
                        {task.progress}%
                      </div>

                      {/* Bar Container */}
                      <div className="w-full bg-slate-800/60 rounded-t-lg overflow-hidden flex items-end h-full max-h-[160px] p-0.5">
                        <div
                          className={`w-full rounded-t transition-all duration-500 ${
                            isDone
                              ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-lg shadow-emerald-500/20'
                              : 'bg-gradient-to-t from-indigo-600 to-violet-400 shadow-lg shadow-indigo-500/20'
                          }`}
                          style={{ height: `${barHeightPct}%` }}
                        />
                      </div>

                      {/* X-Axis Task Label */}
                      <div className="mt-2 text-[10px] font-semibold text-slate-400 truncate w-full text-center group-hover:text-white transition-colors" title={task.title}>
                        {task.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Individual Task Progress Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
            {todayTasks.map((t) => (
              <div
                key={t.id}
                className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between text-xs"
              >
                <div className="truncate pr-2">
                  <span className="font-semibold text-slate-200 block truncate">{t.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{t.startTime} – {t.endTime}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className={`font-mono font-bold ${t.progress >= 100 ? 'text-emerald-400' : 'text-indigo-400'}`}>
                    {t.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
