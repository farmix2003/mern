// const express = require('express')
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const dotenv = require('dotenv')
// const { connection } = require('./db.js')
// const jwt = require('jsonwebtoken')
// import verifyToken = req ('./auth.js')
import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'
import dotenv from 'dotenv'
import { connection } from './db.js'
import jwt from 'jsonwebtoken'
import verifyToken from './auth.js'

dotenv.config();

const app = express();
const router = express.Router()
app.use(bodyParser.json());
const options = {
    origin: 'https://mern-front-brown.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true
};

app.use(cors(options));

app.use(router);

app.options('/api/users/get-users', cors(options))
app.options('/api/users/login', cors(options))
app.options('/api/users/register', cors(options))
app.options('/api/users/delete', cors(options))
app.options('/api/users/block', cors(options))
app.options('/api/users/unblock', cors(options))
app.options('/api/users/logout', cors(options))

app.get("/", (req, res) => {
    res.status(200).json({ message: 'Server is running' });
})

app.get('/api/users/get-users', verifyToken, (req, res) => {

    connection.query('select * from users', (error, results, fields) => {
        if (error) {
            return res.status(500).send({ error: 'Internal Server Error' });
        }
        res.status(200).json(results);
    })
});

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, }, process.env.SECRET_KEY, { expiresIn: '1h' })

}

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, }, process.env.SECRET_KEY)
}


let refreshTokens = []
let accessTokens = []

app.get('/api/token', (req, res) => {
    const token = generateAccessToken()
    accessTokens.push(token)
})

router.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;

    connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (error, results) => {
            if (error) {
                console.error('Error logging in user:', error);
                return res.status(500).json({ success: false, error: 'Failed to login user' });
            }

            if (results.length === 0) {
                return res.status(404).json({ success: false, error: 'Invalid email or password' });
            }

            const user = results[0];
            if (user.status === 'blocked') {
                return res.status(403).json({ success: false, error: 'Your account is blocked. Please contact support.' });
            }

            if (user.email === !email || user.password !== password) {
                return res.status(404).json({ success: false, error: 'Invalid email or password' });
            }

            const accessToken = generateAccessToken(user)
            const refreshToken = generateRefreshToken(user)
            refreshTokens.push(refreshToken)
            console.log("Successfully logged in")
            return res.status(200).json({ success: true, message: 'Successfully logged in', accessToken, refreshToken });
        }
    );
});


router.post('/api/users/register', (req, res) => {
    const { name, email, password } = req.body;
    const registration_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const last_login_time = registration_time;
    const status = 'active';
    connection.query(
        'INSERT INTO users (id, name, email, password, last_login_time, registration_time, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [null, name, email, password, last_login_time, registration_time, status],
        (err, result) => {
            if (err) {
                console.error('Error registering user:', err);
                res.status(500).json({ error: 'Failed to register user' });
            } else {
                console.log('User registered successfully:', result);
                res.status(200).json({ message: 'User registered successfully' });
            }
        }
    );

});

router.delete('/api/users/delete', verifyToken, (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ error: 'Invalid user IDs provided' });
    }

    connection.query(
        'DELETE FROM users WHERE id IN (?)',
        [ids],
        (err, result) => {
            if (err) {
                console.error('Error deleting users:', err);
                return res.status(500).json({ error: 'Failed to delete users' });
            }
            console.log('Users deleted successfully:', result.affectedRows);
            res.status(200).json({ message: 'Users deleted successfully' });
        }
    );
});


router.put('/api/users/block', verifyToken, (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ error: 'Invalid user IDs provided' });
    }
    connection.query(
        'UPDATE users SET status =? WHERE id IN (?)',
        ['blocked', ids],
        (err, result) => {
            if (err) {
                console.error('Error blocking users:', err);
                res.status(500).json({ error: 'Failed to block users' });
            } else {
                console.log('Users blocked successfully:', result);
                res.status(200).json({ message: 'Users blocked successfully' });
            }
        }
    )
})

router.put('/api/users/unblock', verifyToken, (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ error: 'Invalid user IDs provided' });
    }
    connection.query(
        'UPDATE users SET status =? WHERE id IN (?)',
        ['active', ids],
        (err, result) => {
            if (err) {
                console.error('Error unblocking users:', err);
                res.status(500).json({ error: 'Failed to unblock users' });
            } else {
                console.log('Users unblocked successfully:', result);
                res.status(200).json({ message: 'Users unblocked successfully' });
            }
        }
    )
})


router.post('/api/users/logout', verifyToken, (req, res) => {
    res.status(200).json({ success: true, message: 'User logged out successfully' });
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
