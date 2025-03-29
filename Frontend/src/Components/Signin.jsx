import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signin() {
    const [form, setForm] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8000/api/signin', form);
            localStorage.setItem('token', res.data.token);
            alert('Signin successful');
            navigate('/profile');
        } catch (err) {
            alert(err.response?.data?.msg || 'Signin failed');
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md space-y-4">
            <h2 className="text-2xl font-bold mb-4">Doctor Signin</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="email" type="email" onChange={handleChange} value={form.email} placeholder="Email" className="w-full border p-2 rounded" required />
                <input name="password" type="password" onChange={handleChange} value={form.password} placeholder="Password" className="w-full border p-2 rounded" required />
                <button type="submit" className="bg-green-500 w-full text-white p-2 rounded hover:bg-green-600">Signin</button>
            </form>
        </div>
    );
}
