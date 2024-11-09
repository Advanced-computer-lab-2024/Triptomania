import mongoose from "mongoose";
import adminModel from '../../models/admin.js';
import touristModel from '../../models/tourist.js';
import tourismGovernorModel from '../../models/tourismGovernor.js';
import sellerModel from '../../models/seller.js';
import tourGuideModel from '../../models/tourGuide.js';
import advertiserModel from '../../models/advertiser.js';
import ItineraryModel from '../../models/itinerary.js'; // Import the itinerary model
import productModel from '../../models/product.js'; // Import the product model

const addAdmin = async (req, res) => {
    const { adminName, adminUsername, adminPassword } = req.body;

    if (!adminName || !adminUsername || !adminPassword) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        const admin = new adminModel({
            AdminName: adminName,
            AdminUsername: adminUsername,
            AdminPassword: adminPassword
        });

        await admin.save();

        res.status(201).json({ message: "Admin added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}
const deleteAccount = async (req, res) => {
    try {
        const { id, type } = req.body;

        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid category ID format." });
        }

        let deletedAccount;

        // Depending on the type, delete the appropriate account
        switch (type) {
            case "tourist":
                deletedAccount = await touristModel.findByIdAndDelete(id); // Add await and capture result
                break;
            case "tourGuide":
                deletedAccount = await tourGuideModel.findByIdAndDelete(id); // Add await and capture result
                break;
            case "seller":
                deletedAccount = await sellerModel.findByIdAndDelete(id); // Add await and capture result
                break;
            case "advertiser":
                deletedAccount = await advertiserModel.findByIdAndDelete(id); // Add await and capture result
                break;
            case "tourismGovernor":
                deletedAccount = await tourismGovernorModel.findByIdAndDelete(id); // Add await and capture result
                break;
            case "admin":
                deletedAccount = await adminModel.findByIdAndDelete(id); // Add await and capture result
                break;
            default:
                return res.status(400).json({ message: "Invalid type" }); // Return after sending response
        }

        // Check if the account was found and deleted
        if (!deletedAccount) {
            return res.status(404).json({ message: "Account not found or already deleted" });
        }

        // If the account was deleted successfully
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        // In case of any errors during the process
        res.status(500).json({ message: "Something went wrong" });
    }
}

const addTourismGovernor = async (req, res) => {
    const { tourismGovernorName, tourismGovernorUsername, tourismGovernorPassword } = req.body;

    // Validate required fields
    if (!tourismGovernorName || !tourismGovernorUsername || !tourismGovernorPassword) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        // Create a new instance of the tourism governor model
        const tourismGovernor = new tourismGovernorModel({
            TourismGovernorName: tourismGovernorName,
            TourismGovernorUsername: tourismGovernorUsername,
            TourismGovernorPassword: tourismGovernorPassword
        });

        // Save the new tourism governor to the database
        await tourismGovernor.save();

        // Respond with a success message
        res.status(201).json({ message: "Tourism Governor added successfully" });
    } catch (error) {
        console.error("Error saving tourism governor:", error); // Log the error for debugging
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// Function to flag an itinerary


const flagItinerary = async (req, res) => {
    const { id } = req.params; // Extracting itineraryId from query parameters

    try {
        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid itinerary ID format." });
        }
  
        // Find the itinerary by ID
        const itinerary = await ItineraryModel.findById(id);
        
        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found." });
        }
  
        let isFlagged = itinerary.isFlagged;
      
        // Preserve the creatorId and save the itinerary
        await ItineraryModel.findByIdAndUpdate(id, { isFlagged: !isFlagged }, { new: true });
  
        return res.status(200).json({ message: `Itinerary ${isFlagged ? 'unflagged' : 'flagged'} successfully.` });
    } catch (error) {
        console.error("Error toggling itinerary flag:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}



const viewProductsAdmin = async (req, res) => {
    try {
        // Exclude 'Quantity' field by setting it to 0
        const products = await productModel.find();
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving products', error });
    }
};


export default {
    addAdmin,
    deleteAccount,
    addTourismGovernor,
    flagItinerary,
    viewProductsAdmin
}