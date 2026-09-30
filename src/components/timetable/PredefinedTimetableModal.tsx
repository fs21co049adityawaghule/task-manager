import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Plus, Trash2, Edit2, Clock } from 'lucide-react';
import { formatTime12 } from '../../utils/dateUtils';

export const PredefinedTimetableModal: React.FC = () => {
  const { activeModal, closeModal, timetableEntries, deleteTimetableEntry, setEditingItem, openModal } = useApp();

  const isOpen = activeModal === 'predefined';

  const recurringEntries = timetableEntries.filter(e => e.recurring);

  const handleEdit = (entry: any) => {
    setEditingItem(entry);
    openModal('timetable');
  };

  const handleCreateNew = () => {
    setEditingItem(null);
    openModal('timetable');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Predefined Timetable Routines"
      subtitle="Manage your repeating weekly master schedule"
      maxWidth="xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">
            These recurring entries apply automatically to matching days of the week and trigger conflict warnings when tasks overlap.
          </p>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Block
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
          {recurringEntries.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm bg-slate-800/40 rounded-xl border border-slate-800">
              No predefined timetable routines set yet.
            </div>
          ) : (
            recurringEntries.map(entry => (
              <div
                key={entry.id}
                className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{entry.title}</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold text-[10px]">
                      {entry.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="flex items-center gap-1 font-mono text-indigo-300">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      {formatTime12(entry.startTime)} – {formatTime12(entry.endTime)}
                    </span>
                    <span>
                      {entry.days ? entry.days.map(d => d.substring(0, 3)).join(', ') : 'Everyday'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-700/80"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete timetable routine "${entry.title}"?`)) {
                        deleteTimetableEntry(entry.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/80"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
