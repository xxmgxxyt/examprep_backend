const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const loginHandler = async (req, res) => {
    if (!req.body) return res.status(400).json({ "message": "The request body should contains data" })
    const { email, password } = req.body
    try {
        // Find user by email
        const user = await User.findOne({ email: email }).exec()
        if (!user) return res.status(401).json({ "message": "Unauthorized" })
        // Compare passwords
        const match = await bcrypt.compare(password, user.password)
        if (!match) return res.status(401).json({ "message": "Unauthorized" })
        // Create JWTs
        const accessToken = jwt.sign(
            { "email": user.email, "username": user.username, "major": user.major, "userRole": user.role, "userId": user._id, "examsTaken": user.examsTaken },
            process.env.ACCESS_TOKEN,
            { expiresIn: '1h' }
        )
        const refreshToken = jwt.sign(
            { "email": user.email, "role": user.role },
            process.env.REFRESH_TOKEN,
            { expiresIn: '1d' }
        )
        // Store refreshToken with user
        user.refreshToken = refreshToken
        await user.save()
        // Send refreshToken as httpOnly cookie
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }) // 1 day
        // Send token and to client
        res.status(200).json({ accessToken })
    } catch (err) {
        console.error(err)
        res.status(500).json({ "message": "Internal Server Error" })
    }
}

module.exports = { loginHandler }