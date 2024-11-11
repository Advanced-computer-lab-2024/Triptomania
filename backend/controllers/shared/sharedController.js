import mongoose from 'mongoose';
import adminModel from '../../models/admin.js';
import touristModel from '../../models/tourist.js';
import tourismGovernorModel from '../../models/tourismGovernor.js';
import sellerModel from '../../models/seller.js';
import tourGuideModel from '../../models/tourGuide.js';
import advertiserModel from '../../models/advertiser.js';
import bcrypt from 'bcryptjs';

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const { id, type } = req.params;

        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid account ID format." });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        if (newPassword === oldPassword) {
            return res.status(400).json({ message: "New password must be different from the old password" });
        }

        newPass = await hashPassword(newPassword);

        let account;

        // Depending on the type, find the appropriate account
        switch (type) {
            case "tourist":
                account = await touristModel.findByIdAndUpdate(
                    id,
                    { password: newPass },
                    { new: true }
                )
                break;
            case "tourGuide":
                account = await tourGuideModel.findByIdAndUpdate(
                    id,
                    { password: newPass },
                    { new: true }
                )
                break;
            case "seller":
                account = await sellerModel.findByIdAndUpdate(
                    id,
                    { password: newPass },
                    { new: true }
                )
                break;
            case "advertiser":
                account = await advertiserModel.findByIdAndUpdate(
                    id,
                    { password: newPass },
                    { new: true }
                )
                break;
            case "tourismGovernor":
                account = await tourismGovernorModel.findByIdAndUpdate(
                    id,
                    { password: newPass },
                    { new: true }
                )
                break;
            case "admin":
                account = await touristModel.findByIdAndUpdate(
                    id,
                    { password: newPass },
                    { new: true }
                )
                break;
            default:
                return res.status(400).json({ message: "Invalid type" });
        }
    } catch(error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

async function hashPassword(password) {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw new Error('Failed to hash password');
    }
}


export const requestAccountDeletion = async (req, res) => {
    try {
        const { id } = req.query; // Extracting id from query parameters

        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid account ID format." });
        }

        // Check if the account exists in any of the models and set deleteAccount flag
        let account;
        let accountModel;

        // Check for tourist account
        account = await touristModel.findById(id);
        if (account) {
            accountModel = touristModel;
        } else {
            // Check for tour guide account
            account = await tourGuideModel.findById(id);
            if (account) {
                accountModel = tourGuideModel;
            } else {
                // Check for advertiser account
                account = await advertiserModel.findById(id);
                if (account) {
                    accountModel = advertiserModel;
                } else {
                    // Check for seller account
                    account = await sellerModel.findById(id);
                    if (account) {
                        accountModel = sellerModel;
                    }
                }
            }
        }

        // If no account was found, return a 404 error
        if (!account) {
            return res.status(404).json({ message: "Account not found." });
        }

        // Set the deleteAccount flag to true in the found account
        await accountModel.findByIdAndUpdate(id, { deleteAccount: true }, { new: true });

        // Return a success message
        return res.status(200).json({ message: "Account deletion request sent." });
    } catch (error) {
        console.error("Error requesting account deletion:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

export default { requestAccountDeletion, changePassword };
