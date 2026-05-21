const User = require('../models/User')
const bcrypt = require('bcrypt')

const registerHandler = async (req, res) => {
    if (!req.body) return res.status(400).json({ "message": "The request body should contains data" })
    const userObj = req.body
    try {
        // Check for duplicate email
        const duplicate = await User.findOne({ email: userObj.email }).exec()
        if (duplicate) return res.status(409).json({ "message": "Email already registered" })
        // Check for username uniqueness if provided
        if (userObj.username) {
            const usernameDuplicate = await User.findOne({ username: userObj.username }).exec()
            if (usernameDuplicate) {
                return res.status(409).json({ "message": "Username already taken" })
            }
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(userObj.password, 10)
        // Create and store new user
        const newUser = await User.create({
            email: userObj.email,
            username: userObj.username,
            major: userObj.major,
            password: hashedPassword,
            role: userObj.role
        })
        console.log(newUser)
        // Send success response
        res.status(201).json({ "message": `${newUser.username} registered successfully` })
    } catch (err) {
        console.error(err)
        res.status(500).json({ "message": "Internal Server Error" })
    }
}

module.exports = { registerHandler }