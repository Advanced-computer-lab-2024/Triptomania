import mongoose from "mongoose";
import adminModel from '../../models/admin.js';
import tourismGovernorModel from '../../models/tourismGovernor.js';
import promoCodeModel from '../../models/promoCode.js';
import touristModel from '../../models/tourist.js';
import sellerModel from '../../models/seller.js';
import tourGuideModel from '../../models/tourGuide.js';
import advertiserModel from '../../models/advertiser.js';
import ItineraryModel from '../../models/itinerary.js'; // Import the itinerary model
import productModel from '../../models/product.js'; // Import the product model
import activityModel from '../../models/activity.js'; 


const addAdmin = async (req, res) => {
    const { adminName, adminUsername, adminPassword } = req.body;

    if (!adminName || !adminUsername || !adminPassword) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        const admin = new adminModel({
            name: adminName,
            username: adminUsername,
            password: adminPassword
        });

        await admin.save();

        res.status(201).json({ message: "Admin added successfully" });
    } catch (error) {
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
            name: tourismGovernorName,
            username: tourismGovernorUsername,
            password: tourismGovernorPassword
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
                if (!await checkValidity(id)) {
                    return res.status(400).json({ message: "Tourist has active bookings or itineraries" });
                }
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
const checkValidity = async (touristId) => {
    // Check if the tourist has any hotel or flight bookings
    const tourist = await touristModel.findById(touristId); // Use touristModel here
    if (!tourist) {
        throw new Error("Tourist not found");
    }

    // Check if there are any hotel or flight bookings
    if (tourist.hotelBookings.length > 0 || tourist.flightBookings.length > 0 || tourist.transportationBookings.length > 0) {
        return false; // Return false if there are any bookings
    } 

    // Check for upcoming itineraries
    const upcomingItineraries = await ItineraryModel.find({ // Use ItineraryModel here
        bookingMade: { $in: [touristId] },
        isActivated: true,
        availableDates: { $elemMatch: { $gte: new Date().toISOString().split('T')[0] } }
    });

    // Check for upcoming activities
    const upcomingActivities = await activityModel.find({ // Use activityModel here
        creatorId: touristId,
        isBookingOpen: true,
        date: { $gte: new Date() }
    });

    // If there are any upcoming itineraries or activities, return false
    if (upcomingItineraries.length > 0 || upcomingActivities.length > 0) {
        return false;
    }

    // If no bookings and no upcoming itineraries or activities, return true
    return true;
}

const getDeleteUsers = async (req, res) => {
    try {
        const deletedTourists = await touristModel.find({ deleteAccount: true });
        console.log('Deleted Tourists:', deletedTourists); // Log the result
        
        const deletedTourGuides = await tourGuideModel.find({ deleteAccount: true });
        console.log('Deleted Tour Guides:', deletedTourGuides); // Log the result
        
        const deletedAdvertisers = await advertiserModel.find({ deleteAccount: true });
        console.log('Deleted Advertisers:', deletedAdvertisers); // Log the result
        
        const deletedSellers = await sellerModel.find({ deleteAccount: true });
        console.log('Deleted Sellers:', deletedSellers); // Log the result

        const deletedUsers = [
            ...deletedTourists,
            ...deletedTourGuides,
            ...deletedAdvertisers,
            ...deletedSellers
        ];

        // Check if deletedUsers is empty
        if (deletedUsers.length === 0) {
            console.log("No deleted users found.");
        }

        // Check validity for tourists only
        const usersResponse = await Promise.all(deletedUsers.map(async (user) => {
            const userObj = user.toObject(); // Convert Mongoose document to plain object
            if (user.type === 'tourist') {
                try {
                    const isValid = await checkValidity(user._id);
                    return {
                        ...userObj,
                        canDelete: isValid // Add a flag to indicate if the user can be deleted
                    };
                } catch (validityError) {
                    console.error("Error checking validity for user:", user._id, validityError);
                    return {
                        ...userObj,
                        canDelete: false // Default to false if there's an error
                    };
                }
            }
            return {
                ...userObj,
                canDelete: true // Non-tourist users can always be deleted
            };
        }));

        res.status(200).json(usersResponse);
    } catch (error) {
        console.error("Error retrieving deleted users:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

const createPromoCode = async (req, res) => {
    const { code, discount, expiryDate } = req.body;

    if (!code || !discount || !expiryDate) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        const promoCode = new promoCodeModel({
            code,
            discount,
            expiryDate
        });

        await promoCode.save();

        res.status(201).json({ message: "Promo code created successfully" });
    } catch (error) {
        console.error("Error creating promo code:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        // Fetch users from all collections
        const tourists = await touristModel.find();
        const tourGuides = await tourGuideModel.find();
        const advertisers = await advertiserModel.find();
        const sellers = await sellerModel.find();
        const tourismGovernors = await tourismGovernorModel.find();

        // Combine all users into a single array
        const users = [
            ...tourists,
            ...tourGuides,
            ...advertisers,
            ...sellers,
            ...tourismGovernors,
        ];

        // Calculate total users
        const totalUsers = users.length;

        // Group users by month of creation
        const usersByMonth = users.reduce((acc, user) => {
            const createdAt = user.createdAt;
            if (createdAt) {
                const date = new Date(createdAt);
                if (!isNaN(date)) {
                    const monthKey = date.toISOString().slice(0, 7); // Format as YYYY-MM
                    acc[monthKey] = (acc[monthKey] || 0) + 1;
                }
            }
            return acc;
        }, {});

        // Format response
        const response = {
            totalUsers,
            newUsersByMonth: usersByMonth,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

export default {
    addAdmin,
    deleteAccount,
    addTourismGovernor,
    flagItinerary,
    viewProductsAdmin,
    getDeleteUsers,
    createPromoCode,
    getUsers
}