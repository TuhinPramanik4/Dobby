import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    doctorName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: 'doctor'
    },
    password: {
        type: String,
        required: true
    }
});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
