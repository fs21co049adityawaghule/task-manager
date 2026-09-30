import { TaskStatus } from '../types';

export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateReadable(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatTime12(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; // hour 0 is 12 AM
  return `${h}:${m} ${ampm}`;
}

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function calculateDuration(startTime: string, endTime: string): string {
  const startMins = timeToMinutes(startTime);
  const endMins = timeToMinutes(endTime);
  let diff = endMins - startMins;
  if (diff < 0) diff += 24 * 60; // wrapped past midnight

  const hours = Math.floor(diff / 60);
  const mins = diff % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  } else if (hours > 0) {
    return hours === 1 ? '1 hour' : `${hours} hours`;
  } else {
    return `${mins} mins`;
  }
}

export function getDayOfWeekName(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export function evaluateTaskStatus(
  dateStr: string,
  startTime: string,
  endTime: string,
  progress: number
): TaskStatus {
  if (progress >= 100) return 'COMPLETED';

  const todayStr = getTodayString();
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  const startMins = timeToMinutes(startTime);
  const endMins = timeToMinutes(endTime);

  if (dateStr < todayStr) {
    return 'OVERDUE';
  } else if (dateStr > todayStr) {
    return 'UPCOMING';
  } else {
    // Same date as today
    if (currentMins >= startMins && currentMins <= endMins) {
      return 'IN PROGRESS';
    } else if (currentMins > endMins) {
      return 'OVERDUE';
    } else {
      return 'UPCOMING';
    }
  }
}

export function getDaysInMonth(year: number, month: number) {
  // month is 0-indexed (0 = Jan, 11 = Dec)
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    days.push({
      dateString: `${y}-${m}-${d}`,
      dayNumber: date.getDate(),
      dayOfWeek: date.getDay(),
    });
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function getMonthName(monthIndex: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex] || '';
}
