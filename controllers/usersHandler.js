const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const updateUserHandler = async (req, res) => {
    const { email, username, password, userId } = req.body;
    console.log(email, username, password, userId);
    // Check for duplicate email
    const duplicate = await User.findOne({ email: email }).exec()
    if (duplicate) return res.status(409).json({ "message": "Email already registered" })
    // Check for username uniqueness if provided
    if (username) {
        const usernameDuplicate = await User.findOne({ username: username }).exec()
        if (usernameDuplicate) {
            return res.status(409).json({ "message": "Username already taken" })
        }
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.email = email || user.email;
        user.username = username || user.username;
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }
        const updatedUser = await user.save();
        console.log("Updated user:", updatedUser);
        // Create JWTs
        const accessToken = jwt.sign(
            { "email": updatedUser.email, "username": updatedUser.username, "major": updatedUser.major, "userRole": updatedUser.role, "userId": updatedUser._id, "examsTaken": updatedUser.examsTaken },
            process.env.ACCESS_TOKEN,
            { expiresIn: '1h' }
        )
        // Send new token with the updated user data
        res.status(200).json({ message: "User updated successfully", user: updatedUser, accessToken });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteUserHandler = async (req, res) => {
    const token = req.cookies.jwt
    if (!token) return res.status(401).json({ success: false, message: "You need to login first!" });
    // If there is a token, then get the payload data.
    const decode = jwt.decode(token)
    console.log(decode)
    try {
        // Delete the user from database.
        await User.findOneAndDelete({ email: decode.email })
        // Clear cookies and send response
        res.clearCookie("jwt", { httpOnly: true })
        res.status(200).json({ success: true, message: "User has been deleted successfully." });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { updateUserHandler, deleteUserHandler };