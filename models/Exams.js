const mongoose = require("mongoose");

// 1. Define what a single Question looks like
const QuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    answers: { type: [String], required: true }, // Array of strings for choices
    correctAnswer: { type: String, required: true }
});

const ExamsSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    dateAndTime: {
        type: Date,
        default: new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" })
    },
    duration: {
        type: Number,
        required: true
    },
    // 2. Change this from [String] to [QuestionSchema]
    questions: {
        type: [QuestionSchema],
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    studentsAttempted: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("Exam", ExamsSchema);