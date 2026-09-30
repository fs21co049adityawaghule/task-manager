import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Calendar, Plus, User, Cloud, CloudOff } from 'lucide-react';
import { getTodayString, formatDateReadable } from '../../utils/dateUtils';
import { isSupabaseConfigured } from '../../lib/supabase';

export const Header: React.FC = () => {
  const { searchQuery, setSearchQuery, openModal, setEditingItem, currentUser, openAuthModal, isLoadingCloud } = useApp();
  const todayStr = getTodayString();
  const readableDate = formatDateReadable(todayStr);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const userName = currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || 'Aditya';

  return (
    <header className="bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-10 px-4 md:px-8 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Greeting & Date */}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {getGreeting()}, <span className="text-indigo-400">{userName}</span> 👋
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-400 mt-1 font-medium">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>Today is {readableDate}</span>
          </div>
        </div>

        {/* Right Search Bar & Account Trigger */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, meetings..."
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Cloud Auth Status Trigger */}
          <button
            onClick={openAuthModal}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
              currentUser
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Account & Cloud Sync Settings"
          >
            {isLoadingCloud ? (
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            ) : currentUser ? (
              <Cloud className="w-4 h-4 text-emerald-400" />
            ) : (
              <CloudOff className="w-4 h-4 text-slate-400" />
            )}
            <span className="hidden sm:inline">
              {currentUser ? 'Cloud Active' : 'Sign In'}
            </span>
          </button>

          {/* Quick Action Button */}
          <button
            onClick={() => {
              setEditingItem(null);
              openModal('task');
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs md:text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Action</span>
          </button>
        </div>
      </div>
    </header>
  );
};
