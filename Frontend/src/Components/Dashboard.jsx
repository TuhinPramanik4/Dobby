import React, { useState } from "react";
import { Send, Pill, Activity, HeartPulse, Bell, User, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import {  useNavigate } from "react-router-dom";
import { CalendarHeart } from "lucide-react";

const Dashboard = () => {
    const [question, setQuestion] = useState("");
    const [response1, setResponse1] = useState("");
    const [response2, setResponse2] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (question.trim() === "") return;

        setLoading(true);
        setResponse1("");
        setResponse2("");
        setSubmitted(true);

        try {
            const res = await fetch("http://localhost:8000/api/ask-gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ question }),
            });

            if (!res.ok) throw new Error("Failed to fetch response");

            const data = await res.json();
            setResponse1(data.response1);
            setResponse2(data.response2);
        } catch (error) {
            console.error("Error fetching response:", error);
            setResponse1("⚠️ Error fetching AI response. Please try again.");
            setResponse2("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col bg-gradient-to-br from-blue-700 to-blue-400 relative">
            
            {/* Navbar */}
            <nav className="w-full h-16 flex items-center justify-between px-6 bg-white/20 backdrop-blur-md border border-white/30 shadow-md fixed top-0 left-0 z-50">
                <h1 className="text-2xl font-bold text-white">Dobby</h1>

                {/* Desktop Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition"
                     onClick={() => window.location.href = "http://localhost:5173/Medicine_Reminder"} >
                        Add Medicine Reminder
                    </button>

                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
                    <Menu size={28} />
                </button>
            </nav>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="absolute top-16 right-6 bg-white/90 text-blue-600 rounded-lg shadow-lg p-3 flex flex-col gap-2 md:hidden z-50">
                    <button className="px-4 py-2 text-lg font-semibold rounded-lg hover:bg-gray-200 transition" onClick={() => window.location.href = "http://localhost:5173/Medicine_Reminder"}>
                   
                        Add Medicine Reminder
                    </button>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center w-full px-4 mt-16 overflow-auto">
            <motion.h1
    className="hidden sm:block text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center drop-shadow-lg w-full py-4"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
>
    AI-Powered Health Assistant
</motion.h1>

                {/* Response Boxes */}
                {(response1 || response2) && (
                    <motion.div className="z-0 flex flex-col md:flex-row gap-6 w-full max-w-4xl mt-10 px-4">
                        <motion.div
                            className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg text-white text-lg text-center border border-white/30 flex-1"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Pill size={32} className="mx-auto mb-2" />
                            <h2 className="text-xl font-semibold mb-2">Medicine to Take</h2>
                            <p>{response1}</p>
                        </motion.div>
                        <motion.div
                            className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg text-white text-lg text-center border border-white/30 flex-1"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Activity size={32} className="mx-auto mb-2" />
                            <h2 className="text-xl font-semibold mb-2">Activities to Do</h2>
                            <p>{response2}</p>
                        </motion.div>
                    </motion.div>
                )}

                {/* Feature Highlights */}
                {!submitted && (
                    <motion.div className="z-0 flex flex-col md:flex-row gap-6 justify-center items-center mt-10 px-4">
                         <motion.div
            className="bg-white/20 backdrop-blur-md p-6 shadow-lg rounded-xl w-full sm:w-80 h-80 flex flex-col justify-center items-center border border-white/30 text-center"
            whileHover={{ scale: 1.05 }}
        >
           
            <h2 className="text-xl font-semibold text-white">Book a Doctor Appointment</h2>
            <p className="text-white mt-2">
                Get instant access to top medical professionals. Schedule your appointment with ease.
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition">
                <CalendarHeart onClick={() => window.location.href = "http://localhost:5173/booking"} size={20} className="mr-2" /> Book Now
            </button>
        </motion.div>
                    </motion.div>
                )}

                {/* Input Box */}
                <div className="w-full max-w-2xl px-4 mt-10">
                    <motion.div
                        className="flex gap-3 items-center bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/30"
                        whileHover={{ scale: 1.02 }}
                    >
                        <input
                            className="flex-1 p-4 text-lg border-none outline-none bg-transparent text-white placeholder-white w-full"
                            type="text"
                            placeholder="Ask me a health-related question..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <motion.button
                            className="bg-white text-blue-600 px-5 py-3 rounded-xl flex items-center gap-2 text-lg font-semibold shadow-md hover:bg-gray-200 transition"
                            onClick={handleSubmit}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Send size={24} />
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;