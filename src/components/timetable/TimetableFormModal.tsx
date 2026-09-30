import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { TimetableEntry, TimetableType } from '../../types';
import { getTodayString } from '../../utils/dateUtils';

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const TimetableFormModal: React.FC = () => {
  const { activeModal, closeModal, editingItem, addTimetableEntry, updateTimetableEntry } = useApp();

  const isOpen = activeModal === 'timetable';

  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [type, setType] = useState<TimetableType>('College');
  const [recurring, setRecurring] = useState<boolean>(true);
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [date, setDate] = useState<string>(getTodayString());
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingItem && isOpen) {
      const tt = editingItem as TimetableEntry;
      setTitle(tt.title || '');
      setStartTime(tt.startTime || '08:00');
      setEndTime(tt.endTime || '09:00');
      setType(tt.type || 'College');
      setRecurring(tt.recurring ?? true);
      setSelectedDays(tt.days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
      setDate(tt.date || getTodayString());
      setDescription(tt.description || '');
      setError('');
    } else if (isOpen) {
      setTitle('');
      setStartTime('08:00');
      setEndTime('09:00');
      setType('College');
      setRecurring(true);
      setSelectedDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
      setDate(getTodayString());
      setDescription('');
      setError('');
    }
  }, [editingItem, isOpen]);

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a schedule block title.');
      return;
    }
    if (!startTime || !endTime) {
      setError('Please set start and end times.');
      return;
    }
    if (endTime <= startTime) {
      setError('End time must be after start time.');
      return;
    }
    if (recurring && selectedDays.length === 0) {
      setError('Please select at least one day for the recurring schedule.');
      return;
    }

    const payload = {
      title: title.trim(),
      startTime,
      endTime,
      type,
      recurring,
      days: recurring ? selectedDays : undefined,
      date: !recurring ? date : undefined,
      description: description.trim(),
    };

    if (editingItem?.id) {
      updateTimetableEntry({ ...payload, id: editingItem.id });
    } else {
      addTimetableEntry(payload);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={editingItem ? 'Edit Timetable Entry' : 'Add Timetable Entry'}
      subtitle="Define daily timeline blocks and routines"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Block Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Morning Workout / College / Homework"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Type & Repeat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Block Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TimetableType)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="College">🎓 College / University</option>
              <option value="Study">📚 Study / Revision</option>
              <option value="Workout">🏋️ Workout / Fitness</option>
              <option value="Task">📝 Task Block</option>
              <option value="Meeting">🤝 Meeting Block</option>
              <option value="Personal">🧘 Personal Time</option>
              <option value="Other">📌 Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Schedule Mode</label>
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setRecurring(true)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  recurring ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Recurring Weekly
              </button>
              <button
                type="button"
                onClick={() => setRecurring(false)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  !recurring ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Single Date
              </button>
            </div>
          </div>
        </div>

        {/* Start Time & End Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Start Time <span className="text-rose-400">*</span>
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              End Time <span className="text-rose-400">*</span>
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Recurring Days or Single Date */}
        {recurring ? (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Repeat On Days</label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_DAYS.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Specific Date <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details about this timetable block..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            {editingItem ? 'Save Entry' : 'Add to Timetable'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
