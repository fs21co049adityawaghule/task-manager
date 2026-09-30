import React from 'react';
import { SummaryCards } from '../components/home/SummaryCards';
import { QuickActions } from '../components/home/QuickActions';
import { TodayTasks } from '../components/home/TodayTasks';
import { DailyProgressChart } from '../components/home/DailyProgressChart';
import { TodoListsSection } from '../components/home/TodoListsSection';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* 1. Dashboard Top Overview Summary */}
      <SummaryCards />

      {/* 2. Today's Tasks — PRIMARY SECTION (Requirement #3.1) */}
      <TodayTasks />

      {/* 3. Daily Progress Chart (Requirement #5) */}
      <DailyProgressChart />

      {/* 4. Quick Actions Buttons (Requirement #6) */}
      <QuickActions />

      {/* 5. To-Do Lists Section (Requirement #8) */}
      <TodoListsSection />
    </div>
  );
};
