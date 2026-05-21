const User = require("../models/User")

const logoutHandler = async (req, res) => {
    console.log("Logout handler called")
    try {
        const cookies = req.cookies
        if (!cookies?.jwt) return res.status(204).json({ success: false, message: "No content" })
        const refreshToken = cookies.jwt
        // Find user with the refresh token        
        const user = await User.findOne({ refreshToken: refreshToken }).exec()
        if (!user) {
            res.clearCookie("jwt", { httpOnly: true })
            return res.status(204).json({ success: false, message: "No content" })
        }
        // Delete refresh token in database
        user.refreshToken = null
        await user.save()
        // Clear cookie from client
        res.clearCookie("jwt", { httpOnly: true })
        res.status(200).json({ success: true, message: "Logged out successfully" })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: "Server error" })
    }
}

module.exports = logoutHandler;