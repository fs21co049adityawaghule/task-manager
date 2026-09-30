import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, Clock, Calendar } from 'lucide-react';
import { formatTime12 } from '../../utils/dateUtils';

export const ConflictDialog: React.FC = () => {
  const { pendingConflict, confirmConflictOverride, cancelConflictOverride } = useApp();

  if (!pendingConflict) return null;

  const { type, data, conflicts } = pendingConflict;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 glow-amber">
        {/* Header Badge */}
        <div className="flex items-center gap-3 text-amber-400">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-white">⚠ TIME CONFLICT</h3>
            <p className="text-xs text-amber-300/80 font-medium">Overlapping Schedule Detected</p>
          </div>
        </div>

        {/* Proposed Event Details */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attempting to add:</span>
          <p className="font-bold text-white text-base">{data.title}</p>
          <div className="flex items-center gap-3 text-xs text-indigo-300 font-medium pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatTime12(data.startTime)} – {formatTime12(data.endTime)}
            </span>
            {data.date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {data.date}
              </span>
            )}
          </div>
        </div>

        {/* Conflicting Items List */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Overlaps with existing item{conflicts.length > 1 ? 's' : ''}:
          </p>
          <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
            {conflicts.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase mr-2">
                    {item.type}
                  </span>
                  <span className="font-semibold text-slate-200">{item.title}</span>
                </div>
                <div className="text-amber-200/90 font-mono text-[11px] shrink-0 ml-2">
                  {formatTime12(item.startTime)} – {formatTime12(item.endTime)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 italic">
          Would you still like to add this event anyway?
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={cancelConflictOverride}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={confirmConflictOverride}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-600/30 transition-all active:scale-95"
          >
            Add Anyway
          </button>
        </div>
      </div>
    </div>
  );
};
