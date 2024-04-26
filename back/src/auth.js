// const jwt = require('jsonwebtoken')
// const dotenv = require('dotenv')

import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();
const verifyToken = (req, res, next) => {
    const header = req.headers.authorization
    const token = header && header.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, error: 'No token provided' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, error: 'Failed to authenticate token' });
        }

        req.user = decoded;
        next();
    });
};


export default verifyToken
