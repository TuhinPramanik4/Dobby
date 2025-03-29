import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MedicineReminders = () => {
  const [activeTab, setActiveTab] = useState('myReminders');
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [reminders, setReminders] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('https://project-binary.onrender.com/auth/user', { withCredentials: true });
        setUserId(response.data._id);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchReminders();
    }
  }, [userId]);

  const fetchReminders = async () => {
    try {
      const response = await axios.get(https://project-binary.onrender.com/get-reminders/${userId}, { withCredentials: true });
      setReminders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      setReminders([]);
    }
  };

  const handleAddMedicineClick = () => {
    setActiveTab('addNewReminder');
  };

  const handleSaveReminder = async () => {
    if (!userId) {
      alert('User ID is missing. Please log in again.');
      return;
    }
    if (!medicineName.trim() || !time) {
      alert('Please fill in all required fields (Medicine Name and Time).');
      return;
    }

    const newReminder = { userId, medicineName, dosage, time };

    try {
      const response = await axios.post('https://project-binary.onrender.com/add-reminder', newReminder, { withCredentials: true });
      alert(response.data.message);
      setActiveTab('myReminders');
      resetForm();
      fetchReminders();
    } catch (error) {
      console.error('Error saving reminder:', error);
      alert('Failed to save reminder. Please try again.');
    }
  };

  const resetForm = () => {
    setMedicineName('');
    setDosage('');
    setTime('');
  };

  const handleCancel = () => {
    setActiveTab('myReminders');
    resetForm();
  };

  const handleDeleteReminder = async (reminderId) => {
    try {
      await axios.delete(https://project-binary.onrender.com/delete-reminder/${userId}/${reminderId}, { withCredentials: true });
      fetchReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="font-sans bg-gradient-to-br from-sky-100 to-blue-100 min-h-screen p-5">
      <div className="flex items-center mb-8">
        <button className="text-xl mr-2 text-blue-700 hover:text-blue-900 transition-colors" onClick={handleBack}>
          &larr;
        </button>
        <h1 className="text-3xl font-bold text-blue-900">Medicine Reminders</h1>
      </div>

      <div className="grid grid-cols-2 mb-8">
        <button
          className={text-lg py-2 px-4 rounded-t-lg transition-colors duration-300 ${activeTab === 'myReminders' ? 'bg-white text-blue-900 shadow-md' : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800'}}
          onClick={() => setActiveTab('myReminders')}
        >
          My Reminders
        </button>
        <button
          className={text-lg py-2 px-4 rounded-t-lg transition-colors duration-300 ${activeTab === 'addNewReminder' ? 'bg-white text-blue-900 shadow-md' : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800'}}
          onClick={handleAddMedicineClick}
        >
          Add New Reminder
        </button>
      </div>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === 'addNewReminder' ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activeTab === 'addNewReminder' ? -20 : 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          {activeTab === 'myReminders' ? (
            <div>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">My Reminders</h2>
              {reminders.length === 0 ? (
                <p className="text-blue-600 text-center">No medicine reminders yet.</p>
              ) : (
                <div className="space-y-4">
                  {reminders.map((reminder) => (
                    <div key={reminder._id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-start border-l-4 border-blue-500">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900">{reminder.medicineName}</h3>
                        <p className="text-sm text-blue-700">{reminder.dosage}</p>
                        <div className="flex items-center text-sm text-blue-700">
                          <Clock className="mr-1 w-4 h-4 text-blue-500" />
                          <span>Time: {reminder.time}</span>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteReminder(reminder._id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">Add New Reminder</h2>
              <input type="text" placeholder="Medicine Name" className="w-full p-2 border rounded mb-2" value={medicineName} onChange={(e) => setMedicineName(e.target.value)} />
              <input type="text" placeholder="Dosage (optional)" className="w-full p-2 border rounded mb-2" value={dosage} onChange={(e) => setDosage(e.target.value)} />
              <input type="time" className="w-full p-2 border rounded mb-4" value={time} onChange={(e) => setTime(e.target.value)} />
              <div className="flex justify-end space-x-4">
                <button onClick={handleCancel} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancel</button>
                <button onClick={handleSaveReminder} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Reminder</button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MedicineReminders;