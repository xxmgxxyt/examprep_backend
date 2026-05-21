const jwt = require('jsonwebtoken');
const User = require("../models/User")

const verifyJWTs = async (req, res, next) => {
    console.log(req.headers.Authorization);
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, async (err, decoded) => {
        const foundUser = await User.findOne({ email: decoded.email }).exec();
        if (!foundUser) return res.sendStatus(401); //user not found
        if (err) {
            const refreshToken = foundUser.refreshToken;
            if (!refreshToken) return res.sendStatus(403); //Forbidden
            next();
        }
    })
}

module.exports = verifyJWTs;