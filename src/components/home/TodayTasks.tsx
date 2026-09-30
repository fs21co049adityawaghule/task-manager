import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../common/EmptyState';
import { getTodayString, timeToMinutes } from '../../utils/dateUtils';
import { CheckSquare, ArrowUpDown, Filter, Plus } from 'lucide-react';
import { PriorityLevel } from '../../types';

type SortOption = 'time' | 'priority' | 'status' | 'category';

export const TodayTasks: React.FC = () => {
  const { tasks, searchQuery, openModal, setEditingItem } = useApp();
  const todayStr = getTodayString();

  const [sortBy, setSortBy] = useState<SortOption>('time');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Filter tasks for today
  let todayTasks = tasks.filter(t => t.date === todayStr);

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    todayTasks = todayTasks.filter(
      t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }

  // Category Filter
  const categories = Array.from(new Set(tasks.map(t => t.category).filter(Boolean)));
  if (filterCategory !== 'all') {
    todayTasks = todayTasks.filter(t => t.category === filterCategory);
  }

  // Priority Rank Helper
  const priorityRank: Record<PriorityLevel, number> = {
    Urgent: 4,
    High: 3,
    Medium: 2,
    Low: 1,
  };

  // Sorting Logic
  todayTasks.sort((a, b) => {
    if (sortBy === 'priority') {
      const pDiff = priorityRank[b.priority] - priorityRank[a.priority];
      if (pDiff !== 0) return pDiff;
      return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    } else if (sortBy === 'time') {
      return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    } else if (sortBy === 'status') {
      const statusRank = { 'IN PROGRESS': 4, UPCOMING: 3, OVERDUE: 2, COMPLETED: 1 };
      const sDiff = statusRank[b.status] - statusRank[a.status];
      if (sDiff !== 0) return sDiff;
      return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    } else if (sortBy === 'category') {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });

  return (
    <section className="space-y-4 my-6">
      {/* Section Title & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg md:text-xl font-extrabold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            <span>Today's Tasks</span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
              {todayTasks.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Scheduled activities for today prioritized by deadline and urgency
          </p>
        </div>

        {/* Controls: Sort dropdown & Category filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="time" className="bg-slate-900">Time ▼</option>
              <option value="priority" className="bg-slate-900">Priority</option>
              <option value="status" className="bg-slate-900">Status</option>
              <option value="category" className="bg-slate-900">Category</option>
            </select>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c} className="bg-slate-900">{c}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tasks List */}
      {todayTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No Tasks Scheduled for Today"
          description="Create a new task to organize your study, work, or personal schedule for today."
          actionLabel="+ Create Task"
          onAction={() => {
            setEditingItem(null);
            openModal('task');
          }}
        />
      ) : (
        <div className="space-y-3">
          {todayTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </section>
  );
};
