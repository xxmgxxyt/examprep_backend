const Exams = require("../models/Exams");
const User = require("../models/User")
const jwt = require("jsonwebtoken")

const createExamHandler = async (req, res) => {
    const data = req.body
    const examDuration = 60
    // console.log("Received exam data:", data);
    try {
        // Basic validation to ensure required fields are present
        if (!data.subject || !data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
            console.log("Invalid exam data");
            return res.status(400).json({ success: false, message: "Invalid exam data. Subject and questions are required." });
        }
        // Additional validation to ensure each question has the required fields
        if (data.questions.some(q => !q.questionText || !q.answers || !q.correctAnswer)) {
            console.log("Invalid question data");
            return res.status(400).json({ success: false, message: "Each question must have questionText, answers, and correctAnswer." });
        }
        // Create the exam in the database
        console.log("Creating exam with data:", data);
        const newExam = await Exams.create({
            subject: data["subject"],
            duration: examDuration,
            questions: data["questions"],
            createdBy: data["createdBy"],
        });
        newExam.studentsAttempted += 1
        await newExam.save()
        console.log("Exam created successfully:", newExam);
        res.status(200).json({ success: true, message: "Exam created successfully!" });
    } catch (error) {
        console.error("Error creating exam:", error);
        res.status(500).json({ success: false, message: "Error creating exam." });
    }
};

const getExamHandler = async (req, res) => {
    try {
        // Get instructor's name
        const exams = await Exams.find(); // Sort by creation date, newest first
        const users = await User.find({ role: "instructor" });
        // Get the usernames of the instructors who created the exams
        // Remove correct answers from the response to prevent cheating
        const examsWithoutAnswers = exams.map(exam => {
            const { _id, subject, duration, questions, dateAndTime, createdBy } = exam;
            const instructor = users.find(user => user._id.toString() === exam.createdBy.toString()).username;
            const questionsWithoutAnswers = questions.map(q => ({
                questionText: q.questionText,
                answers: q.answers
            }));
            return { _id, subject, duration, questions: questionsWithoutAnswers, dateAndTime, instructor, createdBy };
        });
        // Send the exams without correct answers to the client
        res.status(200).json({ success: true, data: examsWithoutAnswers });
    } catch (error) {
        console.error("Error fetching exams:", error);
        res.status(500).json({ success: false, message: "Error fetching exams." });
    }
};

const deleteExamHandler = async (req, res) => {
    const id = req.params.id
    const token = req.cookies.jwt
    const decode = jwt.decode(token)
    // Check first if the user is an instructor.
    console.log("Decoded token:", decode)
    if (decode.role !== "instructor") return res.status(401).json({ success: false, message: "You're not authorized to access this route" })
    // Check if there is no Id or Token.
    if (!id || !token) return res.status(400).json({ success: false, message: "There was something missing!" })

    try {
        await Exams.findByIdAndDelete(id)
        res.status(200).json({ success: true, message: "Exam has been deleted successfully :)" })
    } catch (err) {
        console.error("Error fetching exams:", err);
        res.status(500).json({ success: false, message: "Error fetching exams." });
    }
}


module.exports = { createExamHandler, getExamHandler, deleteExamHandler };