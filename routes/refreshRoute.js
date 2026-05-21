const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../models/User")

router.get("/", async (req, res) => {
    const cookies = req.cookies;
    console.log("Cookies:", cookies);
    if (!cookies?.jwt) return res.status(401).json({ "message": "Unauthorized" });
    const refreshToken = cookies.jwt;

    try {
        const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
        if (!foundUser) return res.status(403).json({ "message": "Forbidden" });
        // Verify refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
            if (err || foundUser.email !== decoded.email) return res.status(403).json({ "message": "Forbidden" });
            const accessToken = jwt.sign(
                { "email": foundUser.email, "username": foundUser.username, "major": foundUser.major, "userRole": foundUser.role, "userId": foundUser._id },
                process.env.ACCESS_TOKEN,
                { expiresIn: '15m' }
            );
            console.log("Access token has sent to the Frontend!")
            res.status(200).json({ accessToken });
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ "message": "Internal Server Error" })
    }
})

module.exports = router;