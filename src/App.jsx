import { useState, lazy, Suspense } from 'react'
import './App.css'
import { Routes, Route } from 'react-router'
import AppLayout from './components/AppLayout'
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useUser } from './context/UserContext'
import { Toaster } from 'react-hot-toast';

// Lazy-load pages for dramatic initial bundle reduction and instant load
const Hero = lazy(() => import("./pages/Hero"));
const Signup = lazy(() => import("./pages/Signup"));
const Signin = lazy(() => import("./pages/Signin"));
const Ai_Assistant = lazy(() => import("./pages/Ai_Assistant"));
const Brackets = lazy(() => import("./pages/Brackets"));
const Events = lazy(() => import("./pages/Events"));
const Units = lazy(() => import("./pages/Units"));
const Content = lazy(() => import("./pages/Content"));
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const AccountDetails = lazy(() => import("./pages/AccountDetails"));
const SharedBracket = lazy(() => import("./pages/SharedBracket"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950">
    <div className="h-8 w-8 rounded-full border-2 border-stone-200 dark:border-stone-800 border-t-lime-600 animate-spin" />
  </div>
);

function App() {

  const { isLoggedIn, authLoading } = useUser();

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-stone-50/30">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-lime-200 border-t-lime-700" />
        </div>
        <p className="mt-4 text-gray-600 geist-font wght-500">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/share/:share_token" element={<SharedBracket />} />
          {
            !isLoggedIn ? (
              <>
                <Route path="/" element={<Hero />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path='*' element={<Hero/>} />
              </>
            ) : (
              <Route path="/" element={<AppLayout />} >
                <Route index element={<Home/>}/>
                <Route path="ai-assistant" element={<Ai_Assistant />} />
                <Route path="brackets" element={<Brackets />} />
                <Route path="brackets/:bracket" element={<Units />} />
                <Route path="brackets/:bracket/:unit" element={<Content />} />
                <Route path="events" element={<Events />} />
                <Route path="profile" element={<Profile />} />
                <Route path="profile/account" element={<AccountDetails />} />
                <Route path='*' element={<NotFound/>}/>
              </Route>
            )
          }
        </Routes>
      </Suspense>
      <Toaster position="bottom-right" />
      <SpeedInsights />
    </>
  );
}

export default App
