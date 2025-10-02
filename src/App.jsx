import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router'
import AppLayout from './components/AppLayout'
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Ai_Assistant from "./pages/Ai_Assistant"
import Brackets from "./pages/Brackets"
import Events from "./pages/Events"
import Courses from "./pages/Courses"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {

  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<AppLayout />} >
          <Route index element={<Home/>}/>
          <Route path="ai-assistant" element={<Ai_Assistant />} />
          <Route path="brackets" element={<Brackets />} />
          <Route path="brackets/:bracket" element={<Courses />} />
          <Route path="events" element={<Events />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
      <SpeedInsights />
    </>
  );
}

export default App
