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
        const {id, type} = req.body;
        switch (type) {
            case "tourist":
                tourGuideModel.findByIdAndDelete(id);
                break;
            case "tourGuide":
                tourGuideModel.findByIdAndDelete(id);
                break;
            case "seller":
                sellerModel.findByIdAndDelete(id);
                break;
            case "advertiser":
                advertiserModel.findByIdAndDelete(id);
                break;
            case "tourismGoverner":
                tourismGovernerModel.findByIdAndDelete(id);
                break;
            case "admin":
                adminModel.findByIdAndDelete(id);
                break;
            default:
                res.status(400).json({ message: "Invalid type" });
                break;
        }
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export default {
    addAdmin,
    deleteAccount
}