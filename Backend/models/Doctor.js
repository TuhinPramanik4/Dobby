const mongoose = require('mongoose');

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
        default: 'doctor'  // you can set default role as doctor
    }
});

module.exports = mongoose.model('Doctor', doctorSchema);
