// Import necessary modules
import express from 'express';
import dotenv from 'dotenv';    
import { connectDB } from './config/db.js';  

// Load environment variables from .env file
dotenv.config(); 

// Initialize express app
const app = express();
app.use(express.json());


// Listen on port 5000
app.listen(5000, () => {
    connectDB(); // Connect to MongoDB
    console.log('Server started at http://localhost:5000');

});

// Route for "/products" to send a response


// Debugging line to ensure MONGO_URI is loaded properly (uncomment if needed)
// console.log(process.env.MONGO_URI);
