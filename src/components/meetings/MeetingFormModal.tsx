import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Meeting, MeetingType, PriorityLevel, MeetingStatus } from '../../types';
import { getTodayString } from '../../utils/dateUtils';

export const MeetingFormModal: React.FC = () => {
  const { activeModal, closeModal, editingItem, addMeeting, updateMeeting } = useApp();

  const isOpen = activeModal === 'meeting';

  const [title, setTitle] = useState('');
  const [type, setType] = useState<MeetingType>('Video Call');
  const [date, setDate] = useState(getTodayString());
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('12:00');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [reminder, setReminder] = useState<number>(15);
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [status, setStatus] = useState<MeetingStatus>('Scheduled');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingItem && isOpen) {
      const meet = editingItem as Meeting;
      setTitle(meet.title || '');
      setType(meet.type || 'Video Call');
      setDate(meet.date || getTodayString());
      setStartTime(meet.startTime || '11:00');
      setEndTime(meet.endTime || '12:00');
      setContact(meet.contact || '');
      setLocation(meet.location || '');
      setMeetingLink(meet.meetingLink || '');
      setDescription(meet.description || '');
      setNotes(meet.notes || '');
      setReminder(meet.reminder ?? 15);
      setPriority(meet.priority || 'High');
      setStatus(meet.status || 'Scheduled');
      setError('');
    } else if (isOpen) {
      setTitle('');
      setType('Video Call');
      setDate(getTodayString());
      setStartTime('11:00');
      setEndTime('12:00');
      setContact('');
      setLocation('');
      setMeetingLink('');
      setDescription('');
      setNotes('');
      setReminder(15);
      setPriority('High');
      setStatus('Scheduled');
      setError('');
    }
  }, [editingItem, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a meeting title.');
      return;
    }
    if (!date) {
      setError('Please select a date.');
      return;
    }
    if (!startTime || !endTime) {
      setError('Please enter valid start and end times.');
      return;
    }
    if (endTime <= startTime) {
      setError('End time must be after start time.');
      return;
    }

    const meetingPayload = {
      title: title.trim(),
      type,
      date,
      startTime,
      endTime,
      contact: contact.trim() || 'Team',
      location: location.trim(),
      meetingLink: meetingLink.trim(),
      description: description.trim(),
      notes: notes.trim(),
      reminder,
      priority,
      status,
    };

    if (editingItem?.id) {
      updateMeeting({ ...meetingPayload, id: editingItem.id });
    } else {
      addMeeting(meetingPayload);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={editingItem ? 'Edit Meeting / Call' : 'Schedule Meeting or Call'}
      subtitle="Fill in calendar event details"
      maxWidth="xl"
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
            Meeting Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Project Sync & Design Review"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Meeting Type & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as MeetingType)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Video Call">🎥 Video Call</option>
              <option value="Phone Call">📞 Phone Call</option>
              <option value="Meeting">🤝 In-Person Meeting</option>
              <option value="Other">📌 Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Urgent">🔴 Urgent</option>
              <option value="High">🟠 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🔵 Low</option>
            </select>
          </div>
        </div>

        {/* Date, Start Time, End Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Date <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

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

        {/* Contact / Person & Location / Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Contact / Person</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="e.g., Tech Lead / Dr. Sharma"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Meeting Link</label>
            <input
              type="text"
              value={location || meetingLink}
              onChange={(e) => {
                setLocation(e.target.value);
                setMeetingLink(e.target.value);
              }}
              placeholder="Google Meet link or Office Room"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Reminder & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Reminder</label>
            <select
              value={reminder}
              onChange={(e) => setReminder(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={5}>5 minutes before</option>
              <option value={15}>15 minutes before</option>
              <option value={30}>30 minutes before</option>
              <option value={60}>1 hour before</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as MeetingStatus)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Agenda / Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key discussion points or meeting agenda..."
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
            {editingItem ? 'Save Changes' : 'Schedule Meeting'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
