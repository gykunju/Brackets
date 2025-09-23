import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router'
import Home from "./pages/Home"
import Brackets from "./pages/Brackets"
import Events from "./pages/Events"
import Ai_Assistant from "./pages/Ai_Assistant"
import Navigation from "./components/Navigation"

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/brackets' element={<Brackets/>}/>
      <Route path='/events' element={<Brackets/>}/>
      <Route path='/ai-assistant' element={<Ai_Assistant/>}/>
    </Routes>
    <Navigation/>
    </>
  )
}

export default App
