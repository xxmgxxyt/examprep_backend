const User = require("../models/User")
const Exams = require("../models/Exams")

const instructorDashBoard = async (req, res) => {
    try {
        const user = req.body
        console.log(req.body)
        const users = await User.find();
        const exams = await Exams.find();
        // Check if there is missing data
        if (!users || !exams) return res.status(404).json({ success: false, message: "There is no data at the current time!" })
        // Get all current teacher exams
        let studentsCount = 0
        const teacherExams = exams.filter((exam) => exam.createdBy.toString() === user.userId)
        const teachersUsers = users.filter((user) => {
            teacherExams.forEach((exam) => {
                if (user.examsTaken.includes(exam._id)) {
                    studentsCount += 1
                }
            })
        })
        console.log(studentsCount)
        // If the user was an instructor
        if (user.userRole === "instructor") {
            return res.status(200).json({ success: true, data: { studentsCount: studentsCount, examsCount: teacherExams.length } })
        } else if (user.userRole === "student") {
            return res.status(200).json({ success: true, data: { examsCount: user.examsTaken.length } })
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: "There is something went wrong on the Server!" })
    }
}

module.exports = { instructorDashBoard }