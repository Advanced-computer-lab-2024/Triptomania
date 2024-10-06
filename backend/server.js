// Import necessary modules
import express from 'express';
import dotenv from 'dotenv';    
import { connectDB } from './config/db.js';  
import cors from 'cors';

import sellerRoutes from './routes/sellerRoutes.js';
import  adminRoutes from './routes/adminRoutes.js';
import touristRoutes from './routes/touristRoutes.js';
import advertiserRoutes from './routes/advertiserRoutes.js';


import tourismGovernerRoutes from './routes/tourismGovernorRoutes.js';

import guestRoutes from './routes/guestRoutes.js'; // Import guest routes (if applicable)
import tourGuideRoutes from './routes/tourGuideRoutes.js';


dotenv.config(); 

// Initialize express app
const app = express();

// Enable CORS for all routes
app.use(cors());  // Enable CORS middleware globally for all routes

// Enable express to parse JSON
app.use(express.json());

const port = process.env.PORT || 5000;



// Listen on port 5000
app.listen(port, () => {
    connectDB(); // Connect to MongoDB
    console.log(`Server started at http://localhost:${port}`);

});



// Debugging line to ensure MONGO_URI is loaded properly (uncomment if needed)
// console.log(process.env.MONGO_URI);
app.get("/home", (req, res) => {
    res.status(200).send("You have everything installed!");
  });


app.use('/api/seller',sellerRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/tourist',touristRoutes);
app.use('/api/advertiser',advertiserRoutes);

app.use('/api/admin', adminRoutes);

// app.post("/Admin/Product/addProduct",addProduct);
// app.put("/Admin/Product/editProduct/:id",editProduct);


//app.post("/Admin/Product/addProduct",addProduct);

//app.use('/api/tourismGoverner', tourismGovernerRoutes);
//app.get('/api/search', searchHistoricalPlaceByName);

app.use('/api/tourismGoverner', tourismGovernerRoutes);
app.use('/api/tourist', touristRoutes); // Tourist routes
app.use('/api/guest', guestRoutes); // Guest routes (if applicable)

app.use('/api/advertiser', advertiserRoutes);
app.use('/api/tourGuide', tourGuideRoutes);
