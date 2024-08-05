import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose, { connect } from 'mongoose';
import authRoute from './routes/authRoute.js';
import contactsRoute from './routes/contactRoute.js';
import setupSocket from './socket.js';
import messagesRoute from './routes/messagesRoute.js';
import channelRoute from './routes/channelRoute.js';

dotenv.config(); //! all the enviroment variables put inside process.env

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

// !Middlewares
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173' , process.env.ORIGIN],
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
})); 
app.use(express.json());

app.use('/uploads/profiles' , express.static('uploads/profiles'));
app.use('/uploads/files', express.static('uploads/files'));

// ! getting the Cookies from the front end

app.use(cookieParser());

// ! Routes
app.use('/auth' , authRoute);
app.use('/contacts' , contactsRoute);
app.use('/messages' , messagesRoute);
app.use('/channel' , channelRoute);
// ! connect to server
const server = app.listen(port,()=>{
    console.log(`Server listening on ${port} 😎`);
});


// ! Socket
setupSocket(server);

mongoose.connect(databaseURL).then(()=>{
    console.log("Connected to MongoDB...");
}).catch(err=>{
    console.error("Failed to connect to MongoDB",err);
});
