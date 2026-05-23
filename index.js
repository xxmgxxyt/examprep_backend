const express = require('express');
const app = express();
require('dotenv').config()
const { logRequest } = require("./logs/requestsLogs")
const cors = require("cors")
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const allowedOrigins = require("./configs/allowedOrigins")
const connectDB = require('./configs/connectDB');
const verifyJWTs = require('./middlewares/verifyJWTs');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');

// Connect to Database
connectDB();

// Allowed origins for CORS
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    optionsSuccessStatus: 200,
    credentials: true
}
app.use(cors(corsOptions));

// Main Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(logRequest)


// Routes
app.get("/", (req, res) => {
    res.send("Welcome to the Exam Project Back-End")
})
app.use("/register", require("./routes/registerRoute"))
app.use("/login", require("./routes/loginRoute"))
app.use("/refresh-token", require("./routes/refreshRoute"))
app.use("/logout", require("./routes/logoutRoute"))
app.use("/user", require("./routes/usersRoute"))
app.use("/create-exam", require("./routes/createExamRoute"))
app.use("/exams", require("./routes/examsRoute"))
app.use("/dashboard", require("./routes/dashBoardRoute"))
app.use("/validate-exam", require("./routes/examValidationRoute"))
app.use("/results", require("./routes/ExamsResultsRoute"))

// Start the server
mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB database")
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});