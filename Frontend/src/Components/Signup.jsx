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
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md space-y-4">
            <h2 className="text-2xl font-bold mb-4">Doctor Signup</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="doctorName" onChange={handleChange} value={form.doctorName} placeholder="Doctor Name" className="w-full border p-2 rounded" required />
                <input name="email" type="email" onChange={handleChange} value={form.email} placeholder="Email" className="w-full border p-2 rounded" required />
                <input name="password" type="password" onChange={handleChange} value={form.password} placeholder="Password" className="w-full border p-2 rounded" required />
                <button type="submit" className="bg-blue-500 w-full text-white p-2 rounded hover:bg-blue-600">Signup</button>
            </form>
        </div>
    );
}
