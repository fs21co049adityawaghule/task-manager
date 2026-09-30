import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Meeting, TimetableEntry, TodoList, ActiveTab, ConflictCheckResult, ConflictItem } from '../types';
import { getInitialSeedData } from '../utils/seedData';
import { checkTimeConflict } from '../utils/conflictChecker';
import { evaluateTaskStatus } from '../utils/dateUtils';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface PendingConflictAction {
  type: 'task' | 'meeting' | 'timetable';
  data: any;
  conflicts: ConflictItem[];
}

interface AppContextType {
  tasks: Task[];
  meetings: Meeting[];
  timetableEntries: TimetableEntry[];
  todoLists: TodoList[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  // Auth State
  currentUser: any;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  refreshAuth: () => void;
  isLoadingCloud: boolean;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Task Operations
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, force?: boolean) => boolean;
  updateTask: (task: Task, force?: boolean) => boolean;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  updateTaskProgress: (id: string, progress: number) => void;

  // Meeting Operations
  addMeeting: (meeting: Omit<Meeting, 'id'>, force?: boolean) => boolean;
  updateMeeting: (meeting: Meeting, force?: boolean) => boolean;
  deleteMeeting: (id: string) => void;

  // Timetable Operations
  addTimetableEntry: (entry: Omit<TimetableEntry, 'id'>, force?: boolean) => boolean;
  updateTimetableEntry: (entry: TimetableEntry, force?: boolean) => boolean;
  deleteTimetableEntry: (id: string) => void;

  // To-Do List Operations
  addTodoList: (list: Omit<TodoList, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodoList: (list: TodoList) => void;
  deleteTodoList: (id: string) => void;
  toggleTodoItem: (listId: string, itemId: string) => void;
  addTodoItem: (listId: string, text: string) => void;
  removeTodoItem: (listId: string, itemId: string) => void;

  // Conflict Modal State & Handlers
  pendingConflict: PendingConflictAction | null;
  confirmConflictOverride: () => void;
  cancelConflictOverride: () => void;

  // Modal Control Triggers
  activeModal: 'task' | 'meeting' | 'todo' | 'timetable' | 'predefined' | null;
  openModal: (modal: 'task' | 'meeting' | 'todo' | 'timetable' | 'predefined') => void;
  closeModal: () => void;
  editingItem: any | null;
  setEditingItem: (item: any) => void;

  // Utilities
  resetToSampleData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'chrono_flow_app_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([]);
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [searchQuery, setSearchQuery] = useState('');

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoadingCloud, setIsLoadingCloud] = useState(false);

  const [activeModal, setActiveModal] = useState<'task' | 'meeting' | 'todo' | 'timetable' | 'predefined' | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [pendingConflict, setPendingConflict] = useState<PendingConflictAction | null>(null);

  // 1. Auth Observer & Initial Data Load
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then((res: any) => {
        const session = res?.data?.session;
        setCurrentUser(session?.user ?? null);
        if (session?.user) {
          fetchSupabaseData(session.user.id);
        } else {
          loadLocalData();
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        const user = session?.user ?? null;
        setCurrentUser(user);
        if (user) {
          fetchSupabaseData(user.id);
        } else {
          loadLocalData();
        }
      });

      return () => subscription.unsubscribe();
    } else {
      loadLocalData();
    }
  }, []);

  const loadLocalData = () => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTasks(parsed.tasks || []);
        setMeetings(parsed.meetings || []);
        setTimetableEntries(parsed.timetableEntries || []);
        setTodoLists(parsed.todoLists || []);
      } catch (err) {
        seedData();
      }
    } else {
      seedData();
    }
  };

  const fetchSupabaseData = async (userId: string) => {
    if (!supabase) return;
    setIsLoadingCloud(true);
    try {
      // Tasks
      const { data: tData } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('task_date', { ascending: true });

      if (tData) {
        setTasks(tData.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          date: t.task_date,
          startTime: t.start_time ? t.start_time.substring(0, 5) : '09:00',
          endTime: t.end_time ? t.end_time.substring(0, 5) : '10:00',
          priority: t.priority || 'High',
          category: t.category || 'General',
          progress: t.progress ?? 0,
          status: t.status || 'UPCOMING',
          notes: t.notes || '',
          recurring: t.recurring || 'none',
          createdAt: t.created_at,
          updatedAt: t.updated_at
        })));
      }

      // Meetings
      const { data: mData } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', userId)
        .order('meeting_date', { ascending: true });

      if (mData) {
        setMeetings(mData.map((m: any) => ({
          id: m.id,
          title: m.title,
          type: m.type || 'Video Call',
          date: m.meeting_date,
          startTime: m.start_time ? m.start_time.substring(0, 5) : '11:00',
          endTime: m.end_time ? m.end_time.substring(0, 5) : '12:00',
          contact: m.contact || '',
          location: m.location || '',
          meetingLink: m.meeting_link || '',
          description: m.description || '',
          notes: m.notes || '',
          reminder: m.reminder ?? 15,
          priority: m.priority || 'High',
          status: m.status || 'Scheduled'
        })));
      }

      // Timetable
      const { data: ttData } = await supabase
        .from('timetable_entries')
        .select('*')
        .eq('user_id', userId);

      if (ttData) {
        setTimetableEntries(ttData.map((tt: any) => ({
          id: tt.id,
          title: tt.title,
          date: tt.entry_date || undefined,
          startTime: tt.start_time ? tt.start_time.substring(0, 5) : '08:00',
          endTime: tt.end_time ? tt.end_time.substring(0, 5) : '09:00',
          type: tt.type || 'College',
          recurring: tt.recurring ?? true,
          days: tt.days || [],
          description: tt.description || ''
        })));
      }

      // Todo Lists + Items
      const { data: listData } = await supabase
        .from('todo_lists')
        .select('*, todo_items(*)')
        .eq('user_id', userId);

      if (listData) {
        setTodoLists(listData.map((l: any) => ({
          id: l.id,
          title: l.title,
          description: l.description || '',
          createdAt: l.created_at,
          updatedAt: l.updated_at,
          items: (l.todo_items || []).map((item: any) => ({
            id: item.id,
            text: item.title,
            completed: item.completed ?? false
          }))
        })));
      }
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
    } finally {
      setIsLoadingCloud(false);
    }
  };

  // LocalStorage fallback sync
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ tasks, meetings, timetableEntries, todoLists })
      );
    }
  }, [tasks, meetings, timetableEntries, todoLists, currentUser]);

  const seedData = () => {
    const seed = getInitialSeedData();
    setTasks(seed.tasks);
    setMeetings(seed.meetings);
    setTimetableEntries(seed.timetableEntries);
    setTodoLists(seed.todoLists);
  };

  const openModal = (modal: 'task' | 'meeting' | 'todo' | 'timetable' | 'predefined') => {
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingItem(null);
  };

  // Conflict Checker
  const verifyConflict = (
    type: 'task' | 'meeting' | 'timetable',
    data: any,
    excludeId?: string
  ): ConflictCheckResult => {
    const date = data.date || new Date().toISOString().split('T')[0];
    return checkTimeConflict(
      date,
      data.startTime,
      data.endTime,
      tasks,
      meetings,
      timetableEntries,
      excludeId
    );
  };

  // Conflict Override Handler
  const confirmConflictOverride = async () => {
    if (!pendingConflict) return;
    const { type, data } = pendingConflict;

    if (type === 'task') {
      await saveTaskToDb(data);
    } else if (type === 'meeting') {
      await saveMeetingToDb(data);
    } else if (type === 'timetable') {
      await saveTimetableToDb(data);
    }

    setPendingConflict(null);
    closeModal();
  };

  const cancelConflictOverride = () => {
    setPendingConflict(null);
  };

  // DB Sync Helpers
  const saveTaskToDb = async (taskData: any) => {
    if (currentUser && supabase) {
      const dbRow = {
        user_id: currentUser.id,
        title: taskData.title,
        description: taskData.description,
        task_date: taskData.date,
        start_time: taskData.startTime,
        end_time: taskData.endTime,
        priority: taskData.priority,
        category: taskData.category,
        progress: taskData.progress,
        status: taskData.status,
        notes: taskData.notes,
        recurring: taskData.recurring,
      };

      if (taskData.id && taskData.id.includes('-')) {
        const { error } = await supabase.from('tasks').update(dbRow).eq('id', taskData.id);
        if (error) console.error('Supabase task update error:', error);
      } else {
        const { data, error } = await supabase.from('tasks').insert([dbRow]).select().single();
        if (error) console.error('Supabase task insert error:', error);
        if (data) taskData.id = data.id;
      }
    }

    setTasks(prev => {
      const exists = prev.some(t => t.id === taskData.id);
      if (exists) {
        return prev.map(t => (t.id === taskData.id ? { ...taskData, updatedAt: new Date().toISOString() } : t));
      }
      return [...prev, { ...taskData, id: taskData.id || `task-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
    });
  };

  const saveMeetingToDb = async (meetingData: any) => {
    if (currentUser && supabase) {
      const dbRow = {
        user_id: currentUser.id,
        title: meetingData.title,
        type: meetingData.type,
        meeting_date: meetingData.date,
        start_time: meetingData.startTime,
        end_time: meetingData.endTime,
        contact: meetingData.contact,
        location: meetingData.location,
        meeting_link: meetingData.meetingLink,
        description: meetingData.description,
        notes: meetingData.notes,
        reminder: meetingData.reminder,
        priority: meetingData.priority,
        status: meetingData.status,
      };

      if (meetingData.id && meetingData.id.length > 20) {
        await supabase.from('meetings').update(dbRow).eq('id', meetingData.id);
      } else {
        const { data } = await supabase.from('meetings').insert([dbRow]).select().single();
        if (data) meetingData.id = data.id;
      }
    }

    setMeetings(prev => {
      const exists = prev.some(m => m.id === meetingData.id);
      if (exists) {
        return prev.map(m => (m.id === meetingData.id ? meetingData : m));
      }
      return [...prev, { ...meetingData, id: meetingData.id || `meet-${Date.now()}` }];
    });
  };

  const saveTimetableToDb = async (entryData: any) => {
    if (currentUser && supabase) {
      const dbRow = {
        user_id: currentUser.id,
        title: entryData.title,
        entry_date: entryData.date || null,
        start_time: entryData.startTime,
        end_time: entryData.endTime,
        type: entryData.type,
        description: entryData.description,
        recurring: entryData.recurring,
        days: entryData.days || [],
      };

      if (entryData.id && entryData.id.length > 20) {
        await supabase.from('timetable_entries').update(dbRow).eq('id', entryData.id);
      } else {
        const { data } = await supabase.from('timetable_entries').insert([dbRow]).select().single();
        if (data) entryData.id = data.id;
      }
    }

    setTimetableEntries(prev => {
      const exists = prev.some(e => e.id === entryData.id);
      if (exists) {
        return prev.map(e => (e.id === entryData.id ? entryData : e));
      }
      return [...prev, { ...entryData, id: entryData.id || `tt-${Date.now()}` }];
    });
  };

  // Task CRUD Operations
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, force = false): boolean => {
    if (!force) {
      const conflictRes = verifyConflict('task', taskData);
      if (conflictRes.hasConflict) {
        setPendingConflict({ type: 'task', data: taskData, conflicts: conflictRes.conflicts });
        return false;
      }
    }

    saveTaskToDb({ ...taskData });
    closeModal();
    return true;
  };

  const updateTask = (task: Task, force = false): boolean => {
    if (!force) {
      const conflictRes = verifyConflict('task', task, task.id);
      if (conflictRes.hasConflict) {
        setPendingConflict({ type: 'task', data: task, conflicts: conflictRes.conflicts });
        return false;
      }
    }

    saveTaskToDb(task);
    closeModal();
    return true;
  };

  const deleteTask = async (id: string) => {
    if (currentUser && supabase) {
      await supabase.from('tasks').delete().eq('id', id);
    }
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
    const target = tasks.find(t => t.id === id);
    if (!target) return;
    const isDone = target.progress >= 100;
    const newProgress = isDone ? 0 : 100;
    const updated = {
      ...target,
      progress: newProgress,
      status: (newProgress === 100 ? 'COMPLETED' : evaluateTaskStatus(target.date, target.startTime, target.endTime, newProgress)) as any,
    };
    saveTaskToDb(updated);
  };

  const updateTaskProgress = (id: string, progress: number) => {
    const target = tasks.find(t => t.id === id);
    if (!target) return;
    const updated = {
      ...target,
      progress,
      status: (progress >= 100 ? 'COMPLETED' : evaluateTaskStatus(target.date, target.startTime, target.endTime, progress)) as any,
    };
    saveTaskToDb(updated);
  };

  // Meeting Operations
  const addMeeting = (meetingData: Omit<Meeting, 'id'>, force = false): boolean => {
    if (!force) {
      const conflictRes = verifyConflict('meeting', meetingData);
      if (conflictRes.hasConflict) {
        setPendingConflict({ type: 'meeting', data: meetingData, conflicts: conflictRes.conflicts });
        return false;
      }
    }

    saveMeetingToDb(meetingData);
    closeModal();
    return true;
  };

  const updateMeeting = (meeting: Meeting, force = false): boolean => {
    if (!force) {
      const conflictRes = verifyConflict('meeting', meeting, meeting.id);
      if (conflictRes.hasConflict) {
        setPendingConflict({ type: 'meeting', data: meeting, conflicts: conflictRes.conflicts });
        return false;
      }
    }

    saveMeetingToDb(meeting);
    closeModal();
    return true;
  };

  const deleteMeeting = async (id: string) => {
    if (currentUser && supabase) {
      await supabase.from('meetings').delete().eq('id', id);
    }
    setMeetings(prev => prev.filter(m => m.id !== id));
  };

  // Timetable Operations
  const addTimetableEntry = (entryData: Omit<TimetableEntry, 'id'>, force = false): boolean => {
    if (!force) {
      const conflictRes = verifyConflict('timetable', entryData);
      if (conflictRes.hasConflict) {
        setPendingConflict({ type: 'timetable', data: entryData, conflicts: conflictRes.conflicts });
        return false;
      }
    }

    saveTimetableToDb(entryData);
    closeModal();
    return true;
  };

  const updateTimetableEntry = (entry: TimetableEntry, force = false): boolean => {
    if (!force) {
      const conflictRes = verifyConflict('timetable', entry, entry.id);
      if (conflictRes.hasConflict) {
        setPendingConflict({ type: 'timetable', data: entry, conflicts: conflictRes.conflicts });
        return false;
      }
    }

    saveTimetableToDb(entry);
    closeModal();
    return true;
  };

  const deleteTimetableEntry = async (id: string) => {
    if (currentUser && supabase) {
      await supabase.from('timetable_entries').delete().eq('id', id);
    }
    setTimetableEntries(prev => prev.filter(e => e.id !== id));
  };

  // To-Do Operations
  const addTodoList = async (listData: Omit<TodoList, 'id' | 'createdAt' | 'updatedAt'>) => {
    let listId = `todo-${Date.now()}`;
    if (currentUser && supabase) {
      const { data: listRes } = await supabase
        .from('todo_lists')
        .insert([{ user_id: currentUser.id, title: listData.title, description: listData.description }])
        .select()
        .single();

      if (listRes) {
        listId = listRes.id;
        if (listData.items && listData.items.length > 0) {
          const itemRows = listData.items.map((item, idx) => ({
            todo_list_id: listId,
            title: item.text,
            completed: item.completed,
            position: idx,
          }));
          await supabase.from('todo_items').insert(itemRows);
        }
      }
    }

    const newList: TodoList = {
      ...listData,
      id: listId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTodoLists(prev => [...prev, newList]);
    closeModal();
  };

  const updateTodoList = async (list: TodoList) => {
    if (currentUser && supabase) {
      await supabase.from('todo_lists').update({ title: list.title, description: list.description }).eq('id', list.id);
    }
    setTodoLists(prev =>
      prev.map(l => (l.id === list.id ? { ...list, updatedAt: new Date().toISOString() } : l))
    );
    closeModal();
  };

  const deleteTodoList = async (id: string) => {
    if (currentUser && supabase) {
      await supabase.from('todo_lists').delete().eq('id', id);
    }
    setTodoLists(prev => prev.filter(l => l.id !== id));
  };

  const toggleTodoItem = async (listId: string, itemId: string) => {
    const list = todoLists.find(l => l.id === listId);
    if (!list) return;
    const item = list.items.find(i => i.id === itemId);
    if (!item) return;
    const newStatus = !item.completed;

    if (currentUser && supabase) {
      await supabase.from('todo_items').update({ completed: newStatus }).eq('id', itemId);
    }

    setTodoLists(prev =>
      prev.map(l => {
        if (l.id === listId) {
          const updatedItems = l.items.map(i => (i.id === itemId ? { ...i, completed: newStatus } : i));
          return { ...l, items: updatedItems, updatedAt: new Date().toISOString() };
        }
        return l;
      })
    );
  };

  const addTodoItem = async (listId: string, text: string) => {
    if (!text.trim()) return;
    let itemId = `ti-${Date.now()}`;

    if (currentUser && supabase) {
      const { data } = await supabase
        .from('todo_items')
        .insert([{ todo_list_id: listId, title: text.trim(), completed: false }])
        .select()
        .single();
      if (data) itemId = data.id;
    }

    setTodoLists(prev =>
      prev.map(l => {
        if (l.id === listId) {
          const newItem = { id: itemId, text: text.trim(), completed: false };
          return { ...l, items: [...l.items, newItem], updatedAt: new Date().toISOString() };
        }
        return l;
      })
    );
  };

  const removeTodoItem = async (listId: string, itemId: string) => {
    if (currentUser && supabase) {
      await supabase.from('todo_items').delete().eq('id', itemId);
    }
    setTodoLists(prev =>
      prev.map(l => {
        if (l.id === listId) {
          return { ...l, items: l.items.filter(i => i.id !== itemId), updatedAt: new Date().toISOString() };
        }
        return l;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        meetings,
        timetableEntries,
        todoLists,
        activeTab,
        setActiveTab,
        currentUser,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        refreshAuth: () => currentUser && fetchSupabaseData(currentUser.id),
        isLoadingCloud,
        searchQuery,
        setSearchQuery,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        updateTaskProgress,
        addMeeting,
        updateMeeting,
        deleteMeeting,
        addTimetableEntry,
        updateTimetableEntry,
        deleteTimetableEntry,
        addTodoList,
        updateTodoList,
        deleteTodoList,
        toggleTodoItem,
        addTodoItem,
        removeTodoItem,
        pendingConflict,
        confirmConflictOverride,
        cancelConflictOverride,
        activeModal,
        openModal,
        closeModal,
        editingItem,
        setEditingItem,
        resetToSampleData: seedData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
