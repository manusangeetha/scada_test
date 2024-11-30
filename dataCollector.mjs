
import express from 'express'; // Import Express for API
import bodyParser from 'body-parser';
import cors from 'cors';
import ModbusRTU from 'modbus-serial'; // Import ModbusRTU for Modbus communication
import mongoose from 'mongoose'; // Import mongoose to handle MongoDB operations
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for token generation
import { WebSocketServer } from 'ws'; // WebSocket for real-time updates
import http from 'http'; // HTTP server to handle WebSocket upgrade

// Device configurations with separate database and collection names
const devices = [
    { 
        name: 'AHU', 
        ip: '127.0.0.1', 
        port: 502, 
        slaveId: 1, 
        holdingRegisters: [1, 2, 3, 4, 5], 
        dbName: 'HVAC', 
        collectionName: 'TABLET' 
    },
    { 
        name: 'Energy_Data', 
        ip: '127.0.0.2', 
        port: 502, 
        slaveId: 1, 
        holdingRegisters: [1, 2, 3, 4, 5], 
        dbName: 'Energy_Meter', 
        collectionName: 'Energy Meter_01' 
    },
    // Add more device configurations here...
];

// Create Express app
const app = express();
const port = 3002;
app.use(cors());
app.use(bodyParser.json());

// Create HTTP server for WebSocket upgrade check
const server = http.createServer(app);

// WebSocket Server
const wss = new WebSocketServer({ noServer: true });

// Handle HTTP requests that try to connect without WebSocket
server.on('upgrade', (request, socket, head) => {
    if (request.headers['upgrade'] !== 'websocket') {
        // If the connection is not a WebSocket request, respond with 426
        socket.write('HTTP/1.1 426 Upgrade Required\r\n' +
                     'Connection: close\r\n' +
                     'Content-Type: text/plain\r\n' +
                     'Content-Length: 16\r\n' +
                     '\r\n' +
                     'Upgrade Required');
        socket.destroy();
        return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// Broadcast data to all connected WebSocket clients
const broadcastData = (data) => {
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

// Function to save data to MongoDB
const saveDataToDatabase = async (dbName, collectionName, data) => {
    try {
        const dbUri = `mongodb://localhost:27017/${dbName}`;
        const conn = await mongoose.createConnection(dbUri);

        const DataSchema = new mongoose.Schema({
            timestamp: { type: Date, default: Date.now },
            values: [Number],
        });

        const DataModel = conn.model(collectionName, DataSchema, collectionName);
        const newData = new DataModel({ values: data });
        await newData.save();
        await conn.close();
    } catch (error) {
        console.error(`Failed to save data to ${dbName}:`, error);
    }
};

const collectData = async () => {
    for (const device of devices) {
        const client = new ModbusRTU();

        try {
            await client.connectTCP(device.ip, { port: device.port });
            await client.setID(device.slaveId);
            const data = await client.readHoldingRegisters(device.holdingRegisters[0], device.holdingRegisters.length);
            await saveDataToDatabase(device.dbName, device.collectionName, data.data);

            // Broadcast data to WebSocket clients
            const broadcastMessage = {
                device: device.name,
                values: data.data,
                timestamp: new Date()
            };
            broadcastData(broadcastMessage);
            console.log(`Data saved for ${device.name}:`, data.data);
        } catch (error) {
            console.error(`Error reading data from ${device.name}:`, error);
        } finally {
            client.close();
        }
    }
};

// Schedule data collection every 30 seconds
setInterval(() => {
    collectData()
        .then(() => console.log('Data collection completed.'))
        .catch(err => console.error('Error collecting data:', err));
}, 30000);

// Create route to fetch latest data from MongoDB
const fetchLatestData = async (dbName, collectionName, res) => {
    try {
        const dbUri = `mongodb://localhost:27017/${dbName}`;
        const conn = await mongoose.createConnection(dbUri);

        const DataSchema = new mongoose.Schema({
            timestamp: { type: Date, default: Date.now },
            values: [Number],
        });

        const DataModel = conn.model(collectionName, DataSchema, collectionName);
        const latestData = await DataModel.findOne().sort({ timestamp: -1 }).exec();

        await conn.close();

        if (latestData) {
            res.json(latestData);
        } else {
            res.status(404).send('No data found.');
        }
    } catch (error) {
        console.error(`Failed to fetch data from ${dbName}:`, error);
        res.status(500).send('Internal Server Error');
    }
};

// Create API endpoints for each device to fetch latest data
app.get('/api/ahu', (req, res) => fetchLatestData('HVAC', 'TABLET', res));

// Start Express server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Start WebSocket server
wss.on('connection', (ws) => {
    console.log('WebSocket connection established');
});
