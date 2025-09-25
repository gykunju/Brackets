import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router'
import Home from "./pages/Home"
import Brackets from "./pages/Brackets"
import Events from "./pages/Events"
import Ai_Assistant from "./pages/Ai_Assistant"
import Courses from "./pages/Courses"
import Navigation from "./components/Navigation"
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/brackets' element={<Brackets/>}/>
      <Route path='/brackets/:bracket' element={<Courses/>}/>
      <Route path='/events' element={<Events/>}/>
      <Route path='/ai-assistant' element={<Ai_Assistant/>}/>
    </Routes>
    <Navigation/>
    <SpeedInsights />
    </>
  )
}

export default App
