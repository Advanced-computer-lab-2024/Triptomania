// Import necessary modules
import express from 'express';
import dotenv from 'dotenv';    
import { connectDB } from './config/db.js';
import touristRoutes from './routes/touristRoutes.js';
import tourGuideRoutes from './routes/tourGuideRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import advertiserRoutes from './routes/advertiserRoutes.js';
import { addProduct } from './controllers/shared/productController.js';
import { editProduct } from './controllers/shared/productController.js';

// Load environment variables from .env file
dotenv.config(); 

// Initialize express app
const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;


// Listen on port 5000
app.listen(port, () => {
    connectDB(); // Connect to MongoDB
    console.log(`Server started at http://localhost:${port}`);

});



// Debugging line to ensure MONGO_URI is loaded properly (uncomment if needed)
 //console.log(process.env.MONGO_URI);
app.get("/home", (req, res) => {
    res.status(200).send("You have everything installed!");
  });

app.use("/api/tourist", touristRoutes);
app.use("/api/tourGuide", tourGuideRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/advertiser", advertiserRoutes);