import React, { useState, useEffect } from "react";
import { Send, Pill, Activity, Menu, CalendarDays, Stethoscope, CheckCircle, XCircle, Eye, X } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog } from '@headlessui/react';

const Dashboard = () => {
    const [question, setQuestion] = useState("");
    const [response1, setResponse1] = useState("");
    const [response2, setResponse2] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dateTime, setDateTime] = useState(new Date());

    const [showForm, setShowForm] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [patient, setPatient] = useState({ name: '', age: '', number: '', symptoms: '' });

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const doctors = [
        { name: "Dr. John Doe", specialization: "Cardiologist", available: true },
        { name: "Dr. Alice Smith", specialization: "Dermatologist", available: false },
        { name: "Dr. Robert Johnson", specialization: "Neurologist", available: true },
    ];

    const handleSubmit = async () => {
        if (question.trim() === "") return;

        setLoading(true);
        setResponse1("");
        setResponse2("");
        setSubmitted(true);

        try {
            const res = await fetch("https://project-binary.onrender.com/api/ask-gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ question }),
            });

            if (!res.ok) throw new Error("Failed to fetch response");

            const data = await res.json();

            if (data.risky) {
                alert("⚠ AI couldn't confidently answer your question. Please consult a doctor.");
                setResponse1("");
                setResponse2("");
                setSubmitted(false);
            } else {
                setResponse1(data.response1);
                setResponse2(data.response2);
            }

        } catch (error) {
            console.error("Error fetching response:", error);
            setResponse1("⚠ Error fetching AI response. Please try again.");
            setResponse2("");
        } finally {
            setLoading(false);
        }
    };

    const openForm = (doc) => {
        setSelectedDoctor(doc);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setPatient({ name: '', age: '', number: '', symptoms: '' });
    };

    return (
        <div className="w-full h-screen flex flex-col bg-gradient-to-br from-blue-700 to-blue-400 overflow-auto">

            {/* Navbar */}
            <nav className="w-full h-16 flex items-center justify-between px-6 bg-white/20 backdrop-blur-md border border-white/30 shadow-md fixed top-0 left-0 z-50">
                <h1 className="text-2xl font-bold text-white">Dobby</h1>
                <div className="hidden md:flex items-center gap-4">
                    <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition" onClick={() => window.location.href = "/Medicine_Reminder"}>Add Medicine Reminder</button>
                </div>
                <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}><Menu size={28} /></button>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="absolute top-16 right-6 bg-white/90 text-blue-600 rounded-lg shadow-lg p-3 flex flex-col gap-2 md:hidden z-50">
                    <button className="px-4 py-2 text-lg font-semibold rounded-lg hover:bg-gray-200 transition" onClick={() => window.location.href = "/Medicine_Reminder"}>Add Medicine Reminder</button>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center w-full px-4 mt-20 space-y-8">

                {/* Heading */}
                <motion.h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center drop-shadow-lg" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                    AI-Powered Health Assistant
                </motion.h1>

                {/* DateTime + Doctors */}
                {!submitted && (
                    <motion.div className="bg-white/20 backdrop-blur-md p-6 shadow-lg rounded-2xl w-full max-w-5xl border border-white/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>

                        {/* DateTime */}
                        <div className="flex items-center justify-between mb-4 text-white flex-wrap gap-2">
                            <div className="flex items-center gap-2"><CalendarDays size={24} /><h2 className="text-xl font-semibold">Today's Date & Time</h2></div>
                            <p className="text-sm sm:text-base">{dateTime.toLocaleString()}</p>
                        </div>

                        {/* See All Button */}
                        <div className="flex items-center justify-between mb-4 text-white">
                            <h2 className="text-xl font-semibold flex items-center gap-2"><Stethoscope size={24} /> Our Doctors</h2>
                            <button onClick={() => window.location.href = "/alldoctor"} className="flex items-center gap-1 bg-white text-blue-600 px-3 py-1 rounded-lg text-sm font-semibold shadow-md hover:bg-gray-200 transition">
                                <Eye size={16} /> See All
                            </button>
                        </div>

                        {/* Doctors Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {doctors.map((doc, idx) => (
                                <div key={idx} className="flex flex-col justify-between bg-white/10 p-4 rounded-xl border border-white/20 space-y-2">
                                    <div>
                                        <h3 className="text-lg font-semibold">{doc.name}</h3>
                                        <p className="text-sm text-white/80">{doc.specialization}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        {doc.available ? (
                                            <span className="flex items-center text-green-400 font-semibold text-sm"><CheckCircle size={18} className="mr-1" />Available</span>
                                        ) : (
                                            <span className="flex items-center text-red-400 font-semibold text-sm"><XCircle size={18} className="mr-1" />Unavailable</span>
                                        )}
                                        <button onClick={() => doc.available && openForm(doc)} className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold shadow-md transition ${doc.available ? 'bg-white text-blue-600 hover:bg-gray-200' : 'bg-gray-400 text-white cursor-not-allowed'}`} disabled={!doc.available}>
                                            Book
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </motion.div>
                )}

                {/* AI Responses */}
                {(response1 || response2) && (
                    <motion.div className="flex flex-col md:flex-row gap-4 w-full max-w-5xl">
                        <motion.div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg text-white text-base text-center border border-white/30 flex-1" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <Pill size={28} className="mx-auto mb-1" />
                            <h2 className="text-lg font-semibold mb-1">Medicine to Take</h2>
                            <p className="text-sm sm:text-base">{response1}</p>
                        </motion.div>
                        <motion.div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg text-white text-base text-center border border-white/30 flex-1" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <Activity size={28} className="mx-auto mb-1" />
                            <h2 className="text-lg font-semibold mb-1">Activities to Do</h2>
                            <p className="text-sm sm:text-base">{response2}</p>
                        </motion.div>
                    </motion.div>
                )}

                {/* Question Input */}
                <div className="w-full max-w-3xl px-2">
                    <motion.div className="flex gap-2 items-center bg-white/20 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/30 flex-wrap" whileHover={{ scale: 1.02 }}>
                        <input
                            className="flex-1 p-3 text-base sm:text-lg border-none outline-none bg-transparent text-white placeholder-white w-full"
                            type="text"
                            placeholder="Ask me a health-related question..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <motion.button className="bg-white text-blue-600 px-4 py-2 rounded-xl flex items-center gap-2 text-sm sm:text-lg font-semibold shadow-md hover:bg-gray-200 transition" onClick={handleSubmit} whileTap={{ scale: 0.95 }}>
                            <Send size={20} />
                        </motion.button>
                    </motion.div>
                </div>

            </div>

            {/* Booking Form Modal */}
            {showForm && (
                <Dialog open={showForm} onClose={closeForm} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md relative space-y-4">
                        <button onClick={closeForm} className="absolute top-3 right-3 text-gray-500 hover:text-black"><X size={20} /></button>
                        <h2 className="text-2xl font-semibold text-blue-600 text-center">Book Appointment</h2>
                        <p className="text-center text-sm text-gray-600">Dr. {selectedDoctor?.name} ({selectedDoctor?.specialization})</p>
                        <div className="space-y-2">
                            <input type="text" placeholder="Patient Name" className="w-full p-2 border rounded" value={patient.name} onChange={(e) => setPatient({ ...patient, name: e.target.value })} />
                            <input type="number" placeholder="Age" className="w-full p-2 border rounded" value={patient.age} onChange={(e) => setPatient({ ...patient, age: e.target.value })} />
                            <input type="text" placeholder="Phone Number" className="w-full p-2 border rounded" value={patient.number} onChange={(e) => setPatient({ ...patient, number: e.target.value })} />
                            <textarea placeholder="Symptoms" className="w-full p-2 border rounded" value={patient.symptoms} onChange={(e) => setPatient({ ...patient, symptoms: e.target.value })}></textarea>
                        </div>
                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition" onClick={() => { alert("Booking Submitted ✅\n\n" + JSON.stringify(patient, null, 2)); closeForm(); }}>
                            Submit
                        </button>
                    </div>
                </Dialog>
            )}

        </div>
    );
};

export default Dashboard;
