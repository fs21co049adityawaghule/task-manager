import React from 'react';
import { useApp } from '../../context/AppContext';
import { PieChart, TrendingUp, BarChart, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { timeToMinutes } from '../../utils/dateUtils';

interface ReportChartsProps {
  selectedYear: number;
  selectedMonth: number; // 0-11
}

export const ReportCharts: React.FC<ReportChartsProps> = ({ selectedYear, selectedMonth }) => {
  const { tasks, meetings } = useApp();

  // Filter tasks & meetings for selected month
  const monthTasks = tasks.filter(t => {
    const [y, m] = t.date.split('-').map(Number);
    return y === selectedYear && m === selectedMonth + 1;
  });

  const monthMeetings = meetings.filter(m => {
    const [y, mMonth] = m.date.split('-').map(Number);
    return y === selectedYear && mMonth === selectedMonth + 1 && m.status !== 'Cancelled';
  });

  const totalTasks = monthTasks.length;
  const completedTasks = monthTasks.filter(t => t.progress >= 100).length;
  const pendingTasks = monthTasks.filter(t => t.progress < 100 && t.status !== 'OVERDUE').length;
  const overdueTasks = monthTasks.filter(t => t.status === 'OVERDUE').length;
  const avgCompletionPct =
    totalTasks > 0 ? Math.round(monthTasks.reduce((acc, t) => acc + (t.progress || 0), 0) / totalTasks) : 0;

  // Scheduled hours calculation
  let totalScheduledMins = 0;
  let completedScheduledMins = 0;
  monthTasks.forEach(t => {
    const dur = Math.max(0, timeToMinutes(t.endTime) - timeToMinutes(t.startTime));
    totalScheduledMins += dur;
    if (t.progress >= 100) completedScheduledMins += dur;
    else completedScheduledMins += (dur * (t.progress || 0)) / 100;
  });
  monthMeetings.forEach(m => {
    const dur = Math.max(0, timeToMinutes(m.endTime) - timeToMinutes(m.startTime));
    totalScheduledMins += dur;
    if (m.status === 'Completed') completedScheduledMins += dur;
  });

  const totalHours = Math.round((totalScheduledMins / 60) * 10) / 10;
  const completedHours = Math.round((completedScheduledMins / 60) * 10) / 10;

  // Status Distribution percentages
  const statusData = [
    { label: 'Completed', count: completedTasks, color: 'bg-emerald-500', barColor: 'from-emerald-500 to-teal-400' },
    { label: 'In Progress / Pending', count: pendingTasks, color: 'bg-indigo-500', barColor: 'from-indigo-500 to-sky-400' },
    { label: 'Overdue', count: overdueTasks, color: 'bg-rose-500', barColor: 'from-rose-500 to-amber-500' },
  ];

  return (
    <div className="space-y-6 my-6">
      {/* Monthly Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Tasks</span>
          <div className="text-2xl font-extrabold text-white">{totalTasks}</div>
          <p className="text-[11px] text-emerald-400 font-medium">{completedTasks} completed</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Avg Completion</span>
          <div className="text-2xl font-extrabold text-indigo-400 font-mono">{avgCompletionPct}%</div>
          <p className="text-[11px] text-slate-400">Overall monthly target</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Scheduled Hours</span>
          <div className="text-2xl font-extrabold text-sky-400 font-mono">{totalHours}h</div>
          <p className="text-[11px] text-sky-300/80">{completedHours}h completed</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Meetings</span>
          <div className="text-2xl font-extrabold text-amber-400">{monthMeetings.length}</div>
          <p className="text-[11px] text-slate-400">Calendar events</p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Breakdown Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-400" />
            <span>Task Status Distribution</span>
          </h4>

          {totalTasks === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">No task data for selected month.</div>
          ) : (
            <div className="space-y-3">
              {statusData.map((item, idx) => {
                const pct = totalTasks > 0 ? Math.round((item.count / totalTasks) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center font-semibold text-slate-300">
                      <span className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                        {item.label}
                      </span>
                      <span className="font-mono text-slate-400">
                        {item.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.barColor} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Productivity Trend Card */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Productivity & Time Efficiency</span>
          </h4>

          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
                <span>Completed Hours vs Total Scheduled</span>
                <span className="text-emerald-400 font-mono">
                  {totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0}% Efficiency
                </span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalHours > 0 ? Math.min(100, Math.round((completedHours / totalHours) * 100)) : 0}%`
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="block font-semibold text-slate-300 mb-1">Pending Work</span>
                <span className="text-amber-400 font-mono font-bold text-base">{pendingTasks} Tasks</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="block font-semibold text-slate-300 mb-1">Overdue Items</span>
                <span className="text-rose-400 font-mono font-bold text-base">{overdueTasks} Tasks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
