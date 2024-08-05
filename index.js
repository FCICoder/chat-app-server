import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import authRoute from './routes/authRoute.js';
import contactsRoute from './routes/contactRoute.js';
import setupSocket from './socket.js';
import messagesRoute from './routes/messagesRoute.js';
import channelRoute from './routes/channelRoute.js';

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

// Ensure the /tmp/uploads directories exist
const uploadDirs = ['/tmp/uploads/profiles', '/tmp/uploads/files'];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Middlewares
app.use(cors({
    origin:'https://chat-app-client-inky.vercel.app', 
    methods:['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials:true,
    allowedHeaders:['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept', 'X-Custom-Header', 'Cookie']  // Add more headers if needed.
}));
app.use(express.json());
app.use('/uploads/profiles', express.static(path.join('/tmp/uploads/profiles')));
app.use('/uploads/files', express.static(path.join('/tmp/uploads/files')));
app.use(cookieParser());

// Routes
app.use('/auth', authRoute);
app.use('/contacts', contactsRoute);
app.use('/messages', messagesRoute);
app.use('/channel', channelRoute);

// Connect to server
const server = app.listen(port, () => {
    console.log(`Server listening on ${port} 😎`);
});

app.get('/', (req, res) => {
    res.json({ message: 'CORS is working!' });
});

// Socket setup
setupSocket(server);

// Connect to MongoDB
mongoose.connect(databaseURL).then(() => {
    console.log("Connected to MongoDB...");
}).catch(err => {
    console.error("Failed to connect to MongoDB", err);
});
