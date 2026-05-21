const mongoose = require("mongoose");

const examResultSchema = new mongoose.Schema({
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exams", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    data: { type: Object, required: true },
    score: { type: Number, required: true },
    dateTaken: { type: Date, default: Date.now }
});

const ExamResult = mongoose.model("ExamResult", examResultSchema);

module.exports = ExamResult;