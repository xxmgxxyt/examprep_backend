const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String },
    major: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'instructor'], default: 'student' },
    refreshToken: { type: String, default: null },
    examsTaken: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exams', default: [] }]
}, { timestamps: true });

module.exports = mongoose.model("Users", userSchema);