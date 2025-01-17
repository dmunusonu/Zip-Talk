const express = require('express')
const cors = require('cors')
require('dotenv').config().parsed
const connectDB= require('./config/connectDB')
const router =require('./routes/index')
const cookiesParser = require('cookie-parser')
const {app,server}= require('./socket/index')

// Define allowed origins
const allowedOrigins = [
    'http://localhost:3000',
    'https://zip-talk.vercel.app',
    process.env.FRONTEND_URL // Keep your env variable as a fallback
].filter(Boolean); // Remove any undefined values

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

const PORT = process.env.PORT || 8080
app.use(express.json())
app.use(cookiesParser())

app.get('/',(request,response)=>{
    response.json({
        message : "Server running at " + PORT
    })
})

// api endpoints
app.use('/api',router)

connectDB().then(()=>{
    server.listen(PORT,()=>{
        console.log("server running at " + PORT)
    })
})
