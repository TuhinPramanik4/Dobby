import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const [form, setForm] = useState({ doctorName: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/signup', form);
            alert('Signup successful');
            navigate('/signin');
        } catch (err) {
            alert(err.response?.data?.msg || 'Signup failed');
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700">
            <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-lg border border-white/20 max-w-sm w-full">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Doctor Signup</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        name="doctorName" 
                        onChange={handleChange} 
                        value={form.doctorName} 
                        placeholder="Doctor Name" 
                        className="w-full bg-transparent border border-white/30 p-3 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        required 
                    />
                    <input 
                        name="email" 
                        type="email" 
                        onChange={handleChange} 
                        value={form.email} 
                        placeholder="Email" 
                        className="w-full bg-transparent border border-white/30 p-3 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        required 
                    />
                    <input 
                        name="password" 
                        type="password" 
                        onChange={handleChange} 
                        value={form.password} 
                        placeholder="Password" 
                        className="w-full bg-transparent border border-white/30 p-3 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        required 
                    />
                    <button 
                        type="submit" 
                        className="w-full bg-white/20 text-white p-3 rounded-lg hover:bg-white/30 transition-all duration-300"
                    >
                        Signup
                    </button>
                </form>
            </div>
        </div>
    );
}
