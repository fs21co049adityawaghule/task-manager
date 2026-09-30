import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Clock, Calendar, Video, Sparkles, TrendingUp } from 'lucide-react';
import { getTodayString, timeToMinutes } from '../../utils/dateUtils';

export const SummaryCards: React.FC = () => {
  const { tasks, meetings } = useApp();
  const todayStr = getTodayString();

  const todayTasks = tasks.filter(t => t.date === todayStr);
  const totalToday = todayTasks.length;
  const completedToday = todayTasks.filter(t => t.progress >= 100).length;
  const remainingToday = totalToday - completedToday;
  const progressPct = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const todayMeetings = meetings.filter(m => m.date === todayStr && m.status !== 'Cancelled');

  // Calculate free time (24h - total scheduled task & meeting minutes)
  let totalScheduledMins = 0;
  todayTasks.forEach(t => {
    totalScheduledMins += Math.max(0, timeToMinutes(t.endTime) - timeToMinutes(t.startTime));
  });
  todayMeetings.forEach(m => {
    totalScheduledMins += Math.max(0, timeToMinutes(m.endTime) - timeToMinutes(m.startTime));
  });

  const freeHours = Math.max(0, Math.round(((24 * 60 - totalScheduledMins) / 60) * 10) / 10);

  const stats = [
    {
      label: "Today's Tasks",
      value: totalToday,
      subtext: `${remainingToday} remaining`,
      icon: <Calendar className="w-5 h-5 text-indigo-400" />,
      color: 'from-indigo-500/10 to-indigo-500/5 border-indigo-500/20',
    },
    {
      label: 'Completed',
      value: completedToday,
      subtext: `${totalToday} scheduled`,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20',
    },
    {
      label: 'Overall Progress',
      value: `${progressPct}%`,
      subtext: 'Daily target metric',
      icon: <TrendingUp className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-500/10 to-amber-500/5 border-amber-500/20',
    },
    {
      label: 'Meetings / Calls',
      value: todayMeetings.length,
      subtext: 'Today on calendar',
      icon: <Video className="w-5 h-5 text-sky-400" />,
      color: 'from-sky-500/10 to-sky-500/5 border-sky-500/20',
    },
    {
      label: 'Estimated Free Time',
      value: `${freeHours}h`,
      subtext: 'Unscheduled bandwidth',
      icon: <Clock className="w-5 h-5 text-violet-400" />,
      color: 'from-violet-500/10 to-violet-500/5 border-violet-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 my-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} border backdrop-blur-md transition-all hover:scale-[1.02]`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">{stat.label}</span>
            {stat.icon}
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">{stat.value}</div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">{stat.subtext}</p>
        </div>
      ))}
    </div>
  );
};
