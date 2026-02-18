import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppProvider, useApp } from '@/app/context/AppContext';
import { PublicLayout } from '@/app/layouts/PublicLayout';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { LandingPage } from '@/app/pages/LandingPage';
import { LoginPage } from '@/app/pages/auth/LoginPage';
import { SignupPage } from '@/app/pages/auth/SignupPage';

import { DashboardHome } from '@/app/pages/DashboardHome';
import { TimetablePage } from '@/app/pages/TimetablePage';
import { LessonsPage } from '@/app/pages/LessonsPage';
import { TopicDetailPage } from '@/app/pages/TopicDetailPage';
import { QuizPage } from '@/app/pages/QuizPage';
import { AnalyticsPage } from '@/app/pages/AnalyticsPage';
import { UploadFlow } from '@/app/pages/UploadFlow';
import { AIChat } from '@/app/pages/chat/AIChat';
import { RemedialVideoPage } from '@/app/pages/RemedialVideoPage';
import { RevisionModePage } from '@/app/pages/RevisionModePage';
import { NotificationsPage } from '@/app/pages/NotificationsPage';
import { ExamsPage } from '@/app/pages/ExamsPage';
import { ReportsPage } from '@/app/pages/ReportsPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useApp();
  // For prototype, we allow access but checking auth for best practice simulation
  // ideally: return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="timetable" element={<TimetablePage />} />
        <Route path="lessons" element={<LessonsPage />} />
        <Route path="lessons/:topicId" element={<TopicDetailPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="chat" element={<AIChat />} />
        <Route path="chat/:chatId" element={<AIChat />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="exams" element={<ExamsPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>

      {/* Full Screen Flows */}
      <Route path="/upload-setup" element={<ProtectedRoute><UploadFlow /></ProtectedRoute>} />
      <Route path="/video/:videoId" element={<ProtectedRoute><RemedialVideoPage /></ProtectedRoute>} />
      <Route path="/revision/:topicId" element={<ProtectedRoute><RevisionModePage /></ProtectedRoute>} />
    </Routes>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AppProvider>
  );
}