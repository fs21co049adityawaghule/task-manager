import { Task, Meeting, TimetableEntry, ConflictCheckResult, ConflictItem } from '../types';
import { timeToMinutes, getDayOfWeekName } from './dateUtils';

export function checkTimeConflict(
  targetDate: string,
  startTime: string,
  endTime: string,
  tasks: Task[],
  meetings: Meeting[],
  timetableEntries: TimetableEntry[],
  excludeId?: string
): ConflictCheckResult {
  const conflicts: ConflictItem[] = [];
  const targetStart = timeToMinutes(startTime);
  const targetEnd = timeToMinutes(endTime);
  const targetDayOfWeek = getDayOfWeekName(targetDate);

  // Helper for time overlap: two slots (S1, E1) and (S2, E2) overlap if S1 < E2 && S2 < E1
  const isOverlap = (s1: number, e1: number, s2: number, e2: number) => {
    return s1 < e2 && s2 < e1;
  };

  // 1. Check Tasks
  tasks.forEach((t) => {
    if (t.id === excludeId) return;
    if (t.date === targetDate) {
      const tStart = timeToMinutes(t.startTime);
      const tEnd = timeToMinutes(t.endTime);
      if (isOverlap(targetStart, targetEnd, tStart, tEnd)) {
        conflicts.push({
          id: t.id,
          title: t.title,
          type: 'Task',
          startTime: t.startTime,
          endTime: t.endTime,
          date: t.date
        });
      }
    }
  });

  // 2. Check Meetings
  meetings.forEach((m) => {
    if (m.id === excludeId) return;
    if (m.date === targetDate && m.status !== 'Cancelled') {
      const mStart = timeToMinutes(m.startTime);
      const mEnd = timeToMinutes(m.endTime);
      if (isOverlap(targetStart, targetEnd, mStart, mEnd)) {
        conflicts.push({
          id: m.id,
          title: `${m.title} (${m.type})`,
          type: 'Meeting',
          startTime: m.startTime,
          endTime: m.endTime,
          date: m.date
        });
      }
    }
  });

  // 3. Check Timetable Entries
  timetableEntries.forEach((tt) => {
    if (tt.id === excludeId) return;
    let applies = false;
    if (tt.recurring && tt.days && tt.days.includes(targetDayOfWeek)) {
      applies = true;
    } else if (tt.date === targetDate) {
      applies = true;
    }

    if (applies) {
      const ttStart = timeToMinutes(tt.startTime);
      const ttEnd = timeToMinutes(tt.endTime);
      if (isOverlap(targetStart, targetEnd, ttStart, ttEnd)) {
        conflicts.push({
          id: tt.id,
          title: tt.title,
          type: 'Timetable Entry',
          startTime: tt.startTime,
          endTime: tt.endTime,
          date: targetDate
        });
      }
    }
  });

  return {
    hasConflict: conflicts.length > 0,
    conflicts
  };
}
