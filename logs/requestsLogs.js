const path = require("path")
const fs = require("fs")
const { log } = require("console")

const logsDir = path.join(__dirname, "..", "logs")
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir)
}

const requestsLogPath = path.join(logsDir, "requests.log")

const logRequest = (req, res, next) => {
    const logEntry = `${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${req.ip}\n`
    fs.appendFile(requestsLogPath, logEntry, (err) => {
        if (err) {
            console.error("Failed to write request log:", err)
        }
    })
    console.log(logEntry.trim())
    next()
}

module.exports = { logRequest }