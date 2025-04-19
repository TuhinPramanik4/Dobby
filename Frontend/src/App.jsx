import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

// Importing components
import LandingPage from './Components/Landing_page';
import Layout from './Components/Layout'; // The layout component
import MedicineReminder from './Components/Medicine_Reminder';
import SetNumber from './Components/Setnumber';
import AllDoctors from './Components/All_Doc';
import DoctorLogin from './Components/Doctor_Login';
import DoctorDashboard from './Components/Doc_Dashboard';
import ChatInterface from './Components/Chatinterface';
import Signup from './Components/Signup';
import Signin from './Components/Signin';
import Profile from './Components/Profile';
import PatientForm from './Components/Books';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth & Standalone Pages */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/doclogin" element={<DoctorLogin />} />
        <Route path="/docdash" element={<DoctorDashboard />} />

        {/* Dashboard Layout as Parent */}
        <Route path="/dashboard" element={<Layout />}/>
          <Route path="/Medicine_Reminder" element={<MedicineReminder />} />
          <Route path="/setnumber" element={<SetNumber />} />
          <Route path="/alldoctors" element={<AllDoctors />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/booking" element={<PatientForm />} />

        {/* 404 Page Not Found */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
