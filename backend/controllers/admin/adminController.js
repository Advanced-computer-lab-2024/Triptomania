import mongoose from "mongoose";
import adminModel from '../../models/admin.js';
import touristModel from '../../models/tourist.js';
import tourismGovernerModel from '../../models/tourist.js';
import sellerModel from '../../models/seller.js';
import tourGuideModel from '../../models/tourGuide.js';
import advertiserModel from '../../models/advertiser.js';

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
            case "tourismGoverner":
                deletedAccount = await tourismGovernerModel.findByIdAndDelete(id); // Add await and capture result
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



export default {
    addAdmin,
    deleteAccount
}