import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema({
    question_heading: { type: String, required: true },
    response: { type: String, required: true }
});

const reminderSchema = new mongoose.Schema({
    medicineName: String,
    dosage: String,
    time: String,
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    search_history: [String],
    reminders: [reminderSchema], // Embedded reminders array
});

const User = mongoose.model('User', userSchema);

export default User;
