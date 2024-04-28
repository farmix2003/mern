import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import verifyToken from './auth.js'

dotenv.config();

mongoose.connect('mongodb+srv://ffarrux386:KmXZwtslRIay6oel@cluster0.aveiyoe.mongodb.net/mern', {

});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: { type: String, unique: true },
    password: String,
    registration_time: { type: Date, default: Date.now },
    last_login_time: { type: Date, default: Date.now },
    status: { type: String, default: 'active' }
});
const User = mongoose.model('users', userSchema);

const app = express();
const router = express.Router();
app.use(bodyParser.json());
const options = {
    origin: 'https://mern-front-brown.vercel.app',
    // origin: 'http://localhost:5173',
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

app.get('/api/users/get-users', verifyToken, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
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

router.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: 'Invalid email or password' });
        }
        if (user.status === 'blocked') {
            return res.status(403).json({ success: false, error: 'Your account is blocked. Please contact support.' });
        }
        if (user.password !== password) {
            return res.status(404).json({ success: false, error: 'Invalid email or password' });
        }
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        refreshTokens.push(refreshToken)
        await User.updateOne({ email }, { $set: { last_login_time: new Date().toISOString() } });
        console.log("Successfully logged in")
        return res.status(200).json({ success: true, message: 'Successfully logged in', accessToken, refreshToken });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ success: false, error: 'Failed to login user' });
    }
});

router.post('/api/users/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            email: email,
            password: password
        });

        newUser.save()
            .then(result => {
                console.log('User registered successfully');
                res.status(200).json({ message: 'User registered successfully' });
            })
            .catch(error => {
                console.error('Error registering user:', error);
                res.status(500).json({ error: 'Failed to register user' });
            });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

router.delete('/api/users/delete', verifyToken, async (req, res) => {
    const { ids } = req.body;
    try {
        await User.deleteMany({ _id: { $in: ids } });
        console.log('Users deleted successfully');
        res.status(200).json({ message: 'Users deleted successfully' });
    } catch (error) {
        console.error('Error deleting users:', error);
        res.status(500).json({ error: 'Failed to delete users' });
    }
});

router.put('/api/users/block', verifyToken, async (req, res) => {
    const { ids } = req.body;
    try {
        await User.updateMany({ _id: { $in: ids } }, { status: 'blocked' });
        console.log('Users blocked successfully');
        res.status(200).json({ message: 'Users blocked successfully' });
    } catch (error) {
        console.error('Error blocking users:', error);
        res.status(500).json({ error: 'Failed to block users' });
    }
});

router.put('/api/users/unblock', verifyToken, async (req, res) => {
    const { ids } = req.body;
    try {
        await User.updateMany({ _id: { $in: ids } }, { status: 'active' });
        console.log('Users unblocked successfully');
        res.status(200).json({ message: 'Users unblocked successfully' });
    } catch (error) {
        console.error('Error unblocking users:', error);
        res.status(500).json({ error: 'Failed to unblock users' });
    }
});

router.post('/api/users/logout', verifyToken, (req, res) => {
    res.status(200).json({ success: true, message: 'User logged out successfully' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
