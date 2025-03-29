import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Landing_page from './Components/Landing_page'
import Dashboard from './Components/Dashboard';
import Medicine_Reminder from './Components/Medicine_Reminder';
import Setnumber from './Components/Setnumber'

function App() {
  const [count, setCount] = useState(0)

  return (
<Router>
      <Routes>
        <Route path="/" element={<Landing_page />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Medicine_Reminder" element={<Medicine_Reminder />} />
        <Route path="/setnumber" element={<Setnumber />} />
      </Routes>
    </Router>
  )
}

export default App
