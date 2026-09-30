import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';
import { MeetingsPage } from './pages/MeetingsPage';
import { ReportsPage } from './pages/ReportsPage';
import { TimetablePage } from './pages/TimetablePage';
import { CalendarPage } from './pages/CalendarPage';
import { TaskFormModal } from './components/tasks/TaskFormModal';
import { MeetingFormModal } from './components/meetings/MeetingFormModal';
import { TodoFormModal } from './components/todo/TodoFormModal';
import { TimetableFormModal } from './components/timetable/TimetableFormModal';
import { ConflictDialog } from './components/common/ConflictDialog';
import { AuthModal } from './components/auth/AuthModal';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="flex-1 min-w-0 p-4 md:p-8 max-w-7xl mx-auto w-full">
      {activeTab === 'home' && <HomePage />}
      {activeTab === 'meetings' && <MeetingsPage />}
      {activeTab === 'reports' && <ReportsPage />}
      {activeTab === 'timetable' && <TimetablePage />}
      {activeTab === 'calendar' && <CalendarPage />}
    </main>
  );
};

const ModalContainer: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, currentUser, refreshAuth } = useApp();

  return (
    <>
      <TaskFormModal />
      <MeetingFormModal />
      <TodoFormModal />
      <TimetableFormModal />
      <ConflictDialog />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        currentUser={currentUser}
        onAuthStateChange={refreshAuth}
      />
    </>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col md:flex-row bg-[#0b0f19] text-slate-100">
        {/* Persistent Navigation Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <Header />
          <MainContent />
        </div>

        {/* Global Action & Auth Modals */}
        <ModalContainer />
      </div>
    </AppProvider>
  );
}

export default App;
