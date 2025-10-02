import { useState } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router'
import Home from "./pages/Home"
import Brackets from "./pages/Brackets"
import Events from "./pages/Events"
import Ai_Assistant from "./pages/Ai_Assistant"
import Courses from "./pages/Courses"
import CourseDetail from "./pages/CourseDetail"
import Debug from "./pages/Debug"
import AuthPage from "./pages/AuthPage"
import Navigation from "./components/Navigation"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { NotificationProvider } from "./contexts/NotificationContext"
import LearningDashboard from "./components/LearningDashboard"
import VillageCircles from "./components/VillageCircles"
import ParentDashboard from "./components/ParentDashboard"
import SponsorBoard from "./components/SponsorBoard"
import NotificationBell from "./components/NotificationBell"
import EventNotifications from "./components/EventNotifications"
import LearningSnippets from "./components/LearningSnippets"

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-700"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20">
        <div className="text-center">
          <div className="relative mx-auto" style={{ width: '80px', height: '80px' }}>
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-purple-600 animate-spin"></div>
            {/* Middle spinning ring */}
            <div className="absolute inset-0 m-2 rounded-full border-4 border-transparent border-t-purple-500 border-l-indigo-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            {/* Inner pulsing circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Loading Brackets
            </h3>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      {user && (
        <>
          <div className="fixed top-4 right-4 z-50">
            <NotificationBell />
          </div>
          <EventNotifications />
          <LearningSnippets />
        </>
      )}
      
      <Routes>
        <Route path='/login' element={!user ? <AuthPage /> : <Navigate to="/" replace />} />
        <Route path='/debug' element={<Debug />} />
        <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/brackets' element={<ProtectedRoute><Brackets /></ProtectedRoute>} />
        <Route path='/brackets/:bracket' element={<ProtectedRoute><Courses /></ProtectedRoute>} />
        <Route path='/brackets/:bracket/:course' element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
        <Route path='/events' element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path='/ai-assistant' element={<ProtectedRoute><Ai_Assistant /></ProtectedRoute>} />
        <Route path='/dashboard' element={<ProtectedRoute><LearningDashboard /></ProtectedRoute>} />
        <Route path='/village-circles' element={<ProtectedRoute><VillageCircles /></ProtectedRoute>} />
        <Route path='/parent-dashboard' element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
        <Route path='/sponsor-board' element={<ProtectedRoute><SponsorBoard /></ProtectedRoute>} />
        {/* Catch all - redirect to home (which will redirect to login if not authenticated) */}
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
      {user && <Navigation />}
      <SpeedInsights />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
