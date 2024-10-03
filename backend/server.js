// Import necessary modules
import express from 'express';
import dotenv from 'dotenv';    
import { connectDB } from './config/db.js';  
import { addProduct } from './controllers/shared/productController.js';
import { editProduct } from './controllers/shared/productController.js';
import tourismGovernerRoutes from './routes/tourismGovernorRoutes.js';

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



// Debugging line to ensure MONGO_URI is loaded properly (uncomment if needed)
// console.log(process.env.MONGO_URI);
app.get("/home", (req, res) => {
    res.status(200).send("You have everything installed!");
  });

// app.post("/Admin/Product/addProduct",addProduct);
// app.put("/Admin/Product/editProduct/:id",editProduct);


//app.post("/Admin/Product/addProduct",addProduct);

app.use('/api/tourismGoverner', tourismGovernerRoutes);