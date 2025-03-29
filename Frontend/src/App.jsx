import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Landing_page from './Components/Landing_page'
import Dashboard from './Components/Dashboard';
import Medicine_Reminder from './Components/Medicine_Reminder';
import Setnumber from './Components/Setnumber'
import All_Doc from './Components/All_Doc';
import Doctor_Login from './Components/Doctor_Login';
import Doc_Dashboard from './Components/Doc_Dashboard';
import Chatinterface from './Components/Chatinterface';
import Signup from './Components/Signup';
import Signin from './Components/Signin';
import Profile from './Components/Profile';
import PatientForm from './Components/Books'

function App() {
  const [count, setCount] = useState(0)

  return (
<Router>
      <Routes>
        <Route path="/" element={<Landing_page />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Medicine_Reminder" element={<Medicine_Reminder />} />
        <Route path="/setnumber" element={<Setnumber />} />
        <Route path="/alldoctor" element={<All_Doc/>}  />
        <Route path="/doclogin" element={<Doctor_Login/>} />
        <Route path="/docdash" element={<Doc_Dashboard/>} />
        <Route path="/chat" element={<Chatinterface/>} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/booking" element={<PatientForm/>}/>
      </Routes>
    </Router>
  )
}

export default App
