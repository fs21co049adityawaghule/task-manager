export type PriorityLevel = 'Urgent' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'UPCOMING' | 'IN PROGRESS' | 'COMPLETED' | 'OVERDUE';
export type RecurringType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24h)
  endTime: string; // HH:mm (24h)
  priority: PriorityLevel;
  category: string;
  progress: number; // 0 to 100
  status: TaskStatus;
  notes?: string;
  recurring: RecurringType;
  createdAt: string;
  updatedAt: string;
}

export type MeetingType = 'Meeting' | 'Phone Call' | 'Video Call' | 'Other';
export type MeetingStatus = 'Scheduled' | 'Completed' | 'Cancelled';

export interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  contact: string;
  location?: string;
  meetingLink?: string;
  description?: string;
  notes?: string;
  reminder?: number; // minutes before
  priority: PriorityLevel;
  status: MeetingStatus;
}

export type TimetableType = 'Task' | 'Meeting' | 'Call' | 'College' | 'Study' | 'Workout' | 'Personal' | 'Other';

export interface TimetableEntry {
  id: string;
  title: string;
  date?: string; // Specific YYYY-MM-DD date if non-recurring
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: TimetableType;
  recurring: boolean;
  days?: string[]; // e.g., ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  description?: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TodoList {
  id: string;
  title: string;
  description?: string;
  items: TodoItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ConflictItem {
  id: string;
  title: string;
  type: 'Task' | 'Meeting' | 'Timetable Entry';
  startTime: string;
  endTime: string;
  date?: string;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflicts: ConflictItem[];
}

export type ActiveTab = 'home' | 'meetings' | 'reports' | 'timetable' | 'calendar';
