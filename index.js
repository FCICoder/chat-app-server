import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose, { connect } from 'mongoose';
import authRoute from './routes/authRoute.js';

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


// ! getting the Cookies from the front end
app.use(cookieParser());

// ! Routes
app.use('/auth' , authRoute);

// ! connect to server
const server = app.listen(port,()=>{
    console.log(`Server listening on ${port} 😎`);
});

mongoose.connect(databaseURL).then(()=>{
    console.log("Connected to MongoDB...");
}).catch(err=>{
    console.error("Failed to connect to MongoDB",err);
});
