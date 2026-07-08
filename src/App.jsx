import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router'
import AppLayout from './components/AppLayout'
import Hero from "./pages/Hero"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Ai_Assistant from "./pages/Ai_Assistant"
import Brackets from "./pages/Brackets"
import Events from "./pages/Events"
import Units from "./pages/Units"
import Content from "./pages/Content"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import AccountDetails from "./pages/AccountDetails"
import SharedBracket from "./pages/SharedBracket"
import NotFound from "./pages/NotFound"
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useUser } from './context/UserContext'
import { Toaster } from 'react-hot-toast';

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
      <Toaster position="bottom-right" />
      <SpeedInsights />
    </>
  );
}

export default App
