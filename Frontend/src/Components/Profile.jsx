import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8000/api/profile', {
                    headers: { Authorization: token }
                });
                setDoctor(res.data);
            } catch (err) {
                alert('Unauthorized or session expired');
                navigate('/signin');
            }
        };

        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8000/api/patients', {
                    headers: { Authorization: token }
                });
                setAppointments(res.data);
            } catch (err) {
                console.error('Error fetching appointments', err);
            }
        };

        fetchProfile();
        fetchAppointments();
    }, [navigate]);

    const handleAccept = (index) => {
        console.log(`Accepted appointment for ${appointments[index].patientName}`);
        // Logic to accept appointment can be added here
    };

    const handleReject = (index) => {
        console.log(`Rejected appointment for ${appointments[index].patientName}`);
        // Logic to reject appointment can be added here
    };
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve token for authentication
            const response = await fetch(`http://localhost:8000/api/patients/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Failed to delete appointment");
            }

            alert("Appointment deleted successfully");

            // Update state after deletion
            setAppointments((prevAppointments) => prevAppointments.filter(appointment => appointment._id !== id));
        } catch (error) {
            console.error("Error:", error);
            alert("Error deleting appointment");
        }
    };


    return (
        <div className="h-screen flex items-center bg-gradient-to-br from-blue-100 to-blue-300 p-8">
            <div className="flex w-full gap-6 h-full">
                <div className="w-1/3 bg-white bg-opacity-30 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/50 h-full">
                    <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">Doctor Profile</h2>
                    {doctor ? (
                        <div className="space-y-2 text-blue-800">
                            <p><strong>Name:</strong> {doctor.doctorName}</p>
                            <p><strong>Email:</strong> {doctor.email}</p>
                            <p><strong>Role:</strong> {doctor.role}</p>
                        </div>
                    ) : (
                        <p className="text-center text-gray-700">Loading...</p>
                    )}
                </div>

                <div className="w-2/3 bg-white bg-opacity-30 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/50 h-full overflow-y-auto">
                    <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">Incoming Appointments</h2>
                    <div className="space-y-4">
                        {appointments.length > 0 ? (
                            appointments.map((appointment, index) => (
                                <div key={index} className="p-4 bg-white bg-opacity-60 rounded-lg shadow-md border border-white/50">
                                    <p><strong>Patient Name:</strong> {appointment.name}</p>
                                    <p><strong>Age:</strong> {appointment.age}</p>
                                    <p><strong>Gender:</strong> {appointment.gender}</p>
                                    <p><strong>Symptoms:</strong> {appointment.symptoms}</p>
                                    <div className="flex gap-4 mt-2">

                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg"
                                            onClick={() => handleDelete(appointment._id)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg"
                                
                                        >
                                            Join conversation
                                        </button>


                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-700">No appointments available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
