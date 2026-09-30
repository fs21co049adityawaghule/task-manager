import { Task, Meeting, TimetableEntry, TodoList } from '../types';
import { getTodayString } from './dateUtils';

export function getInitialSeedData() {
  const today = getTodayString();
  const [y, m, d] = today.split('-').map(Number);
  
  // Format past/future dates around today
  const formatOffsetDate = (offsetDays: number) => {
    const target = new Date(y, m - 1, d + offsetDays);
    const ty = target.getFullYear();
    const tm = String(target.getMonth() + 1).padStart(2, '0');
    const td = String(target.getDate()).padStart(2, '0');
    return `${ty}-${tm}-${td}`;
  };

  const initialTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Study GATE Mathematics',
      description: 'Linear Algebra matrices and Calculus vector analysis formulas revision.',
      date: today,
      startTime: '06:30',
      endTime: '07:30',
      priority: 'High',
      category: 'Study',
      progress: 100,
      status: 'COMPLETED',
      notes: 'Completed all 15 previous year problems.',
      recurring: 'daily',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'task-2',
      title: 'Revise Network Theory',
      description: 'Transient response of RL & RC circuits and two-port parameter matrices.',
      date: today,
      startTime: '07:30',
      endTime: '08:30',
      priority: 'Urgent',
      category: 'Study',
      progress: 60,
      status: 'IN PROGRESS',
      notes: 'Focus on Laplace transform method.',
      recurring: 'daily',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'task-3',
      title: 'College Lectures & Lab Session',
      description: 'Attend Embedded Systems lecture and Microcontroller programming lab.',
      date: today,
      startTime: '09:00',
      endTime: '13:00',
      priority: 'Medium',
      category: 'College',
      progress: 0,
      status: 'UPCOMING',
      notes: 'Bring lab record notebook.',
      recurring: 'weekly',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'task-4',
      title: 'Complete Web Application Development',
      description: 'Finish building modern dashboard responsive views and charts integration.',
      date: today,
      startTime: '14:00',
      endTime: '16:00',
      priority: 'High',
      category: 'Work',
      progress: 85,
      status: 'IN PROGRESS',
      notes: 'Test on mobile and desktop breakpoints.',
      recurring: 'none',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'task-5',
      title: 'Personal Study & Homework Assignment',
      description: 'Solve Digital Signal Processing assignment questions 1 to 5.',
      date: today,
      startTime: '18:00',
      endTime: '20:00',
      priority: 'Medium',
      category: 'Study',
      progress: 0,
      status: 'UPCOMING',
      notes: '',
      recurring: 'none',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'task-6',
      title: 'Signals & Systems Quiz Prep',
      description: 'Review Fourier Transform properties and impulse responses.',
      date: formatOffsetDate(1),
      startTime: '10:00',
      endTime: '11:30',
      priority: 'High',
      category: 'Study',
      progress: 0,
      status: 'UPCOMING',
      notes: 'Prepare concise formula sheet.',
      recurring: 'none',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const initialMeetings: Meeting[] = [
    {
      id: 'meet-1',
      title: 'Project Sync & Review',
      type: 'Video Call',
      date: today,
      startTime: '16:30',
      endTime: '17:30',
      contact: 'Tech Team lead & Designers',
      location: 'Google Meet',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      description: 'Weekly sprint update and UI feedback review.',
      notes: 'Discuss responsive drawer design and timetable conflict warning rules.',
      reminder: 15,
      priority: 'High',
      status: 'Scheduled'
    },
    {
      id: 'meet-2',
      title: 'Professor Guidance Session',
      type: 'Meeting',
      date: formatOffsetDate(2),
      startTime: '11:00',
      endTime: '12:00',
      contact: 'Dr. Sharma (ECE Dept)',
      location: 'Office 304, Academic Block B',
      description: 'Final year capstone project thesis discussion.',
      notes: 'Bring printed architecture diagram draft.',
      reminder: 30,
      priority: 'Urgent',
      status: 'Scheduled'
    }
  ];

  const initialTimetableEntries: TimetableEntry[] = [
    {
      id: 'tt-1',
      title: 'Morning Fitness & Workout',
      startTime: '05:00',
      endTime: '06:00',
      type: 'Workout',
      recurring: true,
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      description: 'Cardio and strength training exercise routine.'
    },
    {
      id: 'tt-2',
      title: 'Morning GATE Study Block',
      startTime: '06:00',
      endTime: '07:30',
      type: 'Study',
      recurring: true,
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      description: 'Core Engineering concepts revision.'
    },
    {
      id: 'tt-3',
      title: 'College Lectures',
      startTime: '08:00',
      endTime: '18:00',
      type: 'College',
      recurring: true,
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      description: 'Classes, lab practicals, and library hours.'
    },
    {
      id: 'tt-4',
      title: 'Homework & Assignment Work',
      startTime: '18:00',
      endTime: '20:00',
      type: 'Task',
      recurring: true,
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      description: 'Daily college coursework assignments.'
    },
    {
      id: 'tt-5',
      title: 'Personal Self-Study',
      startTime: '20:00',
      endTime: '22:00',
      type: 'Study',
      recurring: true,
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      description: 'Deep work and problem solving practice.'
    }
  ];

  const initialTodoLists: TodoList[] = [
    {
      id: 'todo-1',
      title: 'GATE Preparation Checklist',
      description: 'Core syllabus target milestones',
      items: [
        { id: 'ti-1', text: 'Network Theory', completed: true },
        { id: 'ti-2', text: 'Signals & Systems', completed: true },
        { id: 'ti-3', text: 'Digital Electronics', completed: false },
        { id: 'ti-4', text: 'Control Systems', completed: false },
        { id: 'ti-5', text: 'Electromagnetic Theory', completed: false }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'todo-2',
      title: 'Weekly Administrative Tasks',
      description: 'Personal errands and college submissions',
      items: [
        { id: 'ti-6', text: 'Submit Embedded Systems Lab Report', completed: true },
        { id: 'ti-7', text: 'Pay College Semester Fee', completed: false },
        { id: 'ti-8', text: 'Backup Project Code to GitHub', completed: true }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  return {
    tasks: initialTasks,
    meetings: initialMeetings,
    timetableEntries: initialTimetableEntries,
    todoLists: initialTodoLists
  };
}
