// Import necessary modules
import express from 'express';
import dotenv from 'dotenv';    
import cors from 'cors';
import { connectDB } from './config/db.js';  
import sellerRoutes from './routes/sellerRoutes.js';
import  adminRoutes from './routes/adminRoutes.js';
import touristRoutes from './routes/touristRoutes.js';
import tourGuideRoutes from './routes/tourGuideRoutes.js';
import advertiserRoutes from './routes/advertiserRoutes.js';
import tourismGovernerRoutes from './routes/tourismGovernorRoutes.js';


dotenv.config(); 

// Initialize express app
const app = express();

// Enable express to parse JSON

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('controllers'));

app.use(express.static('frontend'));


const port = process.env.PORT || 5000;


// Route to serve Google Maps API key
app.get('/api/maps-key', (req, res) => {
  res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

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


app.use('/api/seller',sellerRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/tourist',touristRoutes);
app.use('/api/advertiser',advertiserRoutes);


//app.post("/Admin/Product/addProduct",addProduct);

//app.use('/api/tourismGoverner', tourismGovernerRoutes);
////app.get('/api/search', searchHistoricalPlaceByName);

app.use('/api/tourismGoverner', tourismGovernerRoutes);
app.use('/api/tourGuide', tourGuideRoutes);


app.use(express.static('controllers'));

