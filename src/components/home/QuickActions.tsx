import React from 'react';
import { useApp } from '../../context/AppContext';
import { PlusCircle, Video, ListTodo, Clock, Zap } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const { openModal, setEditingItem } = useApp();

  const handleOpen = (modal: 'task' | 'meeting' | 'todo' | 'timetable') => {
    setEditingItem(null);
    openModal(modal);
  };

  const buttons = [
    {
      label: 'Create Task',
      sublabel: 'Add to today list',
      modal: 'task' as const,
      icon: <PlusCircle className="w-5 h-5 text-emerald-400" />,
      color: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
    },
    {
      label: 'Create Meeting / Call',
      sublabel: 'Schedule on calendar',
      modal: 'meeting' as const,
      icon: <Video className="w-5 h-5 text-sky-400" />,
      color: 'bg-sky-500/10 hover:bg-sky-500/20 border-sky-500/30 text-sky-300',
    },
    {
      label: 'Create To-Do List',
      sublabel: 'Checklist breakdown',
      modal: 'todo' as const,
      icon: <ListTodo className="w-5 h-5 text-indigo-400" />,
      color: 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30 text-indigo-300',
    },
    {
      label: 'Add Timetable Entry',
      sublabel: 'Set routine block',
      modal: 'timetable' as const,
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      color: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300',
    },
  ];

  return (
    <section className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 my-6 space-y-3">
      <div className="flex items-center gap-2 text-white font-extrabold text-base">
        <Zap className="w-4 h-4 text-amber-400" />
        <span>Quick Actions</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            onClick={() => handleOpen(btn.modal)}
            className={`p-4 rounded-xl border flex items-center gap-3 text-left transition-all hover:scale-[1.02] active:scale-95 ${btn.color}`}
          >
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/50 shrink-0">
              {btn.icon}
            </div>
            <div>
              <div className="font-bold text-sm text-slate-100">{btn.label}</div>
              <div className="text-[11px] text-slate-400">{btn.sublabel}</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
