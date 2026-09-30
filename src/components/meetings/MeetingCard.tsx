import React from 'react';
import { Meeting } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Video, 
  Phone, 
  Users, 
  MapPin, 
  ExternalLink, 
  Clock, 
  Calendar as CalendarIcon, 
  Edit3, 
  Trash2, 
  Bell 
} from 'lucide-react';
import { formatDateReadable, formatTime12, calculateDuration } from '../../utils/dateUtils';

interface MeetingCardProps {
  meeting: Meeting;
  onSelect?: () => void;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onSelect }) => {
  const { deleteMeeting, setEditingItem, openModal } = useApp();

  const duration = calculateDuration(meeting.startTime, meeting.endTime);

  const typeIcons = {
    'Video Call': <Video className="w-4 h-4 text-sky-400" />,
    'Phone Call': <Phone className="w-4 h-4 text-emerald-400" />,
    Meeting: <Users className="w-4 h-4 text-amber-400" />,
    Other: <Clock className="w-4 h-4 text-indigo-400" />,
  };

  const statusColors = {
    Scheduled: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    Completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Cancelled: 'bg-rose-500/20 text-rose-300 border-rose-500/30 line-through',
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(meeting);
    openModal('meeting');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete meeting "${meeting.title}"?`)) {
      deleteMeeting(meeting.id);
    }
  };

  return (
    <div
      onClick={onSelect}
      className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 shadow-lg transition-all space-y-3 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
              {typeIcons[meeting.type]}
            </span>
            <h4 className="font-bold text-base text-slate-100 group-hover:text-indigo-300 transition-colors">
              {meeting.title}
            </h4>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                statusColors[meeting.status]
              }`}
            >
              {meeting.status}
            </span>
          </div>

          <p className="text-xs text-slate-400 font-medium">{meeting.contact}</p>
        </div>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800"
            title="Edit Meeting"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
            title="Delete Meeting"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date & Time Row */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-1.5 text-indigo-300 font-mono">
          <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
          <span>{formatDateReadable(meeting.date)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-indigo-300 font-mono">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            {formatTime12(meeting.startTime)} – {formatTime12(meeting.endTime)} ({duration})
          </span>
        </div>
      </div>

      {/* Location / Meeting Link */}
      {(meeting.location || meeting.meetingLink) && (
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{meeting.location || meeting.meetingLink}</span>
          </span>

          {meeting.meetingLink && meeting.meetingLink.startsWith('http') && (
            <a
              href={meeting.meetingLink}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] shrink-0"
            >
              <span>Join</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Description & Reminder */}
      {meeting.description && (
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {meeting.description}
        </p>
      )}

      {meeting.reminder && (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-300/90 font-medium">
          <Bell className="w-3 h-3 text-amber-400" />
          <span>Reminder set for {meeting.reminder} mins before</span>
        </div>
      )}
    </div>
  );
};
