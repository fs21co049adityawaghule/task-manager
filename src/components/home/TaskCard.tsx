import React from 'react';
import { Task } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Edit3, 
  Trash2, 
  Tag, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { formatTime12, calculateDuration } from '../../utils/dateUtils';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { toggleTaskComplete, deleteTask, setEditingItem, openModal, updateTaskProgress } = useApp();

  const isDone = task.progress >= 100;
  const duration = calculateDuration(task.startTime, task.endTime);

  const priorityColors = {
    Urgent: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
    High: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    Medium: 'bg-sky-500/15 border-sky-500/30 text-sky-300',
    Low: 'bg-slate-500/15 border-slate-500/30 text-slate-400',
  };

  const statusColors = {
    COMPLETED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'IN PROGRESS': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 animate-pulse',
    OVERDUE: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    UPCOMING: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  const handleEdit = () => {
    setEditingItem(task);
    openModal('task');
  };

  const handleDelete = () => {
    if (window.confirm(`Delete task "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  return (
    <div
      className={`group p-4 rounded-2xl border transition-all duration-200 ${
        isDone
          ? 'bg-slate-900/40 border-slate-800/80 opacity-75'
          : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/40 shadow-lg shadow-black/20'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left Side: Checkbox + Details */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <button
            onClick={() => toggleTaskComplete(task.id)}
            className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors shrink-0 focus:outline-none"
            title={isDone ? 'Mark in progress' : 'Mark completed'}
          >
            {isDone ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-500/10" />
            ) : (
              <Circle className="w-6 h-6 text-slate-500 hover:text-emerald-400" />
            )}
          </button>

          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Header: Title + Status + Category */}
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={`font-bold text-base md:text-lg tracking-tight ${
                  isDone ? 'line-through text-slate-400' : 'text-slate-100'
                }`}
              >
                {task.title}
              </h3>

              {/* Status Pill */}
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${
                  statusColors[task.status]
                }`}
              >
                {task.status}
              </span>

              {/* Category Pill */}
              {task.category && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[11px] font-medium">
                  <Tag className="w-3 h-3 text-indigo-400" />
                  {task.category}
                </span>
              )}
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}

            {/* Notes */}
            {task.notes && (
              <div className="flex items-center gap-1.5 text-xs text-amber-300/80 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 max-w-fit">
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{task.notes}</span>
              </div>
            )}

            {/* Interactive Progress Slider */}
            <div className="flex items-center gap-3 pt-1 max-w-xs">
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              <span className="text-[11px] font-mono font-semibold text-slate-400">
                {task.progress}%
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: TIME DISPLAY (CRITICAL REQUIREMENT #3.1) + Priority + Action Buttons */}
        <div className="flex flex-col items-end text-right shrink-0 gap-2 border-l border-slate-800/80 pl-4">
          {/* Priority Pill */}
          <span
            className={`px-2.5 py-0.5 rounded-full border text-xs font-extrabold uppercase tracking-wider ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>

          {/* Time Display */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-end gap-1.5 font-mono text-xs md:text-sm font-bold text-indigo-300">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {formatTime12(task.startTime)} – {formatTime12(task.endTime)}
              </span>
            </div>
            <div className="text-[11px] font-medium text-slate-400">
              {duration}
            </div>
          </div>

          {/* Edit / Delete Buttons */}
          <div className="flex items-center gap-1 pt-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEdit}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
              title="Edit Task"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
