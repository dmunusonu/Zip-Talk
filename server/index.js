const express = require('express')
const cors = require('cors')
require('dotenv').config().parsed
const connectDB= require('./config/connectDB')
const router =require('./routes/index')
const cookiesParser = require('cookie-parser')
const {app,server}= require('./socket/index')

// Define all allowed origins
const allowedOrigins = [
    'http://localhost:3000',
    'https://zip-talk.vercel.app',
    'https://zip-talk-5pu71mpkh-debendras-projects-955fe7e2.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('Blocked origin:', origin); // For debugging
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

const PORT = process.env.PORT || 8080
app.use(express.json())
app.use(cookiesParser())

// Rest of your code...
