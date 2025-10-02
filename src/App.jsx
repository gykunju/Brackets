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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lime-700 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Brackets...</p>
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
