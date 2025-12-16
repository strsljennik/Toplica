const bcrypt = require('bcrypt');
const { User } = require('./mongo');

// username -> socketId
const activeUsers = new Map();

// REGISTRACIJA
async function register(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const role = username === 'Radio Galaksija' ? 'admin' : 'guest';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = new User({ username, password: hashedPassword, role });
        await user.save();
        res.status(201).send('User registered');
    } catch (err) {
        res.status(400).send('User already exists');
    }
}

// LOGIN
async function login(req, res, io) {
    const { username, password } = req.body;
    const socketId = req.headers['x-socket-id'];

    if (!username || !password || !socketId) {
        return res.status(400).send('Missing data');
    }

    // dozvoli login samo ako je isti socket
    if (activeUsers.has(username) && activeUsers.get(username) !== socketId) {
        return res.status(400).send('User already logged in');
    }

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send('Invalid credentials');

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(400).send('Invalid credentials');

        activeUsers.set(username, socketId);

        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
            socket.emit('userLoggedIn', {
                username,
                role: user.role
            });

            socket.on('disconnect', () => {
                if (activeUsers.get(username) === socketId) {
                    activeUsers.delete(username);
                }
            });
        }

        res.send(`Logged in as ${user.role}`);
    } catch (err) {
        res.status(500).send('Server error');
    }
}

module.exports = { register, login };
