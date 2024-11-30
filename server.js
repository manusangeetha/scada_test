
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const WebSocket = require('ws'); // WebSocket library

// Initialize app
const app = express();
const port = 3001; // Choose any port you prefer
const mongoUri = 'mongodb://localhost:27017/admin'; // MongoDB URI
const hvacDb = mongoose.createConnection('mongodb://localhost:27017/HVAC', { useNewUrlParser: true, useUnifiedTopology: true });
const energyMeterDb = mongoose.createConnection('mongodb://localhost:27017/Energy_Meter', { useNewUrlParser: true, useUnifiedTopology: true });


// Middleware with updated CORS configuration
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://192.168.29.117:3000'], // Allow both origins
    credentials: true,
}));

// Connect to MongoDB
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Define user schema with isDisabled field
const userSchema = new mongoose.Schema({
    employeeId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    isDisabled: { type: Boolean, default: false } // Field to track disabled status
});
const User = mongoose.model('users', userSchema);

// Define SCADA data schema
const scadaDataSchema = new mongoose.Schema({
    deviceId: String,
    slaveId: Number,
    status: Boolean,
    data: {
        register40001: Number,
        register40002: Number,
        register40003: Number,
    },
    timestamp: { type: Date, default: Date.now },
    controlAction: String,
    operatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
});
const ScadaData = mongoose.model('ScadaData', scadaDataSchema);

// Signup route for creating new users
app.post('/signup', async (req, res) => {
    const { employeeId, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ employeeId });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ employeeId, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding user', error });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { employeeId, password } = req.body;

    try {
        // Find user by employeeId
        const user = await User.findOne({ employeeId });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials or server error' });
        }

        // Check if the user's account is disabled
        if (user.isDisabled) {
            return res.status(403).json({ message: 'Account is disabled. Please contact the administrator.' });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials or server error' });
        }

        // If login is successful
        res.json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
});

// Fetch all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// Create a new user
app.post('/users', async (req, res) => {
    const { employeeId, password, role } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ employeeId, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
});

app.get('/api/machines/summary', async (req, res) => {
    try {
        // Create an array of collections to query
        const collections = [
            { name: 'ahuCount', collection: AHUCollection },
            { name: 'boilerCount', collection: BoilerCollection },
            { name: 'energyMeterCount', collection: EnergyMeterCollection },
            { name: 'airCompressorCount', collection: AirCompressorCollection },
            { name: 'chillerCount', collection: ChillerCollection },
            { name: 'waterSystemCount', collection: WaterSystemCollection },
        ];

        // Use Promise.all to fetch all counts in parallel
        const counts = await Promise.all(
            collections.map(async (item) => {
                try {
                    const count = await item.collection.countDocuments();
                    return { [item.name]: count };
                } catch (error) {
                    console.error(`Error fetching count for ${item.name}:`, {
                        message: error.message,
                        stack: error.stack,
                    });
                    return { [item.name]: 0 }; // Default to 0 on error
                }
            })
        );

        // Merge results into a single object
        const summary = counts.reduce((acc, curr) => ({ ...acc, ...curr }), {});

        res.json(summary);
    } catch (error) {
        console.error("Error fetching machine summary:", {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).send("Failed to fetch summary data");
    }
});


// Fetch AHUs route
app.get('/api/ahus', async (req, res) => {
    try {
        const ahuData = await ScadaData.find({});
        res.json(ahuData);
    } catch (error) {
        console.error('Error fetching AHU data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// WebSocket server creation
const wsServer = new WebSocket.Server({ noServer: true });
wsServer.on('connection', (socket) => {
    console.log('WebSocket connection established');
    socket.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

// Handle HTTP requests and WebSocket connections on the same server
app.server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
app.server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, (socket) => {
        wsServer.emit('connection', socket, request);
    });
});
