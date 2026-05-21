const Exams = require("../models/Exams")
const ExamResult = require("../models/ExamsResults")
const User = require("../models/User")

const examValidationHandler = async (req, res) => {
    const id = req.params.id
    const { userOptions, examStatus, userId } = req.body
    // Check if the user has already taken the exam
    const user = await User.findById(userId)
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found." })
    }
    if (user.examsTaken.includes(id)) {
        return res.status(400).json({ success: false, message: "User has already taken this exam." })
    }
    try {
        // Find the exam by ID
        const exam = await Exams.findById(id)
        if (!exam) {
            return res.status(404).json({ success: false, message: "Exam not found." })
        }
        const correctAnswers = exam.questions.map(q => q.correctAnswer)
        const examResult = {
            correct: 0,
            total: correctAnswers.length,
            percentage: 0,
            passed: false
        }
        // Validate the user's answers against the correct answers
        correctAnswers.map((answer, index) => {
            if (Number(answer) - 1 === userOptions[index]) {
                examResult.correct += 1
            }
        })
        // Calculate the percentage and determine if the user passed the exam
        examResult.percentage = (examResult.correct / examResult.total) * 100
        examResult.passed = examResult.total === examResult.correct
        console.log("Exam validation result:", examResult)
        // Save the exam result to the database
        const savedResult = await ExamResult.create({
            examId: id,
            studentId: userId,
            data: examResult,
            status: examResult.passed,
            score: examResult.percentage
        });
        // Add the exam Id to the user's examsTaken array
        await User.findByIdAndUpdate(userId, { $push: { examsTaken: id } });
        res.status(200).json({ success: true, message: "Exam validation received successfully!", result: examResult, savedResult })
    } catch (err) {
        console.error("Error validating exam:", err)
        return res.status(500).json({ success: false, message: "Error validating exam." })
    }
}

module.exports = examValidationHandler;