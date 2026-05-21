const ExamsResults = require("../models/ExamsResults");

const resultsHandler = async (req, res) => {
    try {
        const examsResults = await ExamsResults.find();
        res.status(200).json({ success: true, message: "Exam results received successfully!", data: examsResults });
    } catch (err) {
        console.error("Error fetching exams results:", err);
        res.status(500).json({ success: false, message: "Error fetching exams results!" });
    }
}

module.exports = resultsHandler;