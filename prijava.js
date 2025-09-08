const bcrypt = require('bcrypt');
const { User } = require('./mongo');

const activeUsers = {}; 
// primer: { "Radio Galaksija": 2, "R-Galaksija": 1 }

let galaksijaLocked = null; 
// "Radio Galaksija" ili "R-Galaksija" ili null

// Registracija
async function register(req, res, io) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    const role = (username === 'Radio Galaksija' || username === 'R-Galaksija') ? 'admin' : 'guest';
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });

    try {
        await user.save();
        res.status(201).send('User registered');
    } catch (err) {
        console.error('Greška prilikom registracije:', err);
        res.status(400).send('Error registering user');
    }
}

// Login
async function login(req, res, io) {
    const { username, password } = req.body;
    const socketId = req.headers['x-socket-id'];

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    try {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            
            // Ako je Galaksija nalog
            if (username === 'Radio Galaksija' || username === 'R-Galaksija') {
                if (galaksijaLocked && galaksijaLocked !== username) {
                    return res.status(403).send('Drugi Galaksija nalog je već ulogovan.');
                }
                galaksijaLocked = username;
            }

            // Uvećaj broj aktivnih sesija za tog usera
            activeUsers[username] = (activeUsers[username] || 0) + 1;

            const role = user.role;
            const socket = io.sockets.sockets.get(socketId);
            if (socket) {
                socket.emit('userLoggedIn', { username, role });

                // Kad socket pukne ili se korisnik prebaci
                socket.on("disconnect", () => {
                    if (activeUsers[username]) {
                        activeUsers[username]--;
                        if (activeUsers[username] <= 0) {
                            delete activeUsers[username];
                            if (galaksijaLocked === username) {
                                galaksijaLocked = null; // oslobodi mesto
                            }
                        }
                    }
                });
            }

            res.send(role === 'admin' ? 'Logged in as admin' : 'Logged in as guest');
        } else {
            res.status(400).send('Invalid credentials');
        }
    } catch (err) {
        console.error('Greška prilikom logovanja:', err);
        res.status(500).send('Server error');
    }
}

module.exports = { register, login };
