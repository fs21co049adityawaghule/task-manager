import React from 'react';
import { IntegratedCalendar } from '../components/calendar/IntegratedCalendar';

export const CalendarPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <IntegratedCalendar />
    </div>
  );
};
