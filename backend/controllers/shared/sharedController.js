import mongoose from 'mongoose';
import adminModel from '../../models/admin.js';
import touristModel from '../../models/tourist.js';
import tourismGovernorModel from '../../models/tourismGovernor.js';
import sellerModel from '../../models/seller.js';
import tourGuideModel from '../../models/tourGuide.js';
import advertiserModel from '../../models/advertiser.js';
import bcrypt from 'bcryptjs';
import firebase from '../../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';
import { fileTypeFromBuffer } from 'file-type';

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
                account = await adminModel.findByIdAndUpdate(
                    id,
                    { password: newPass },
                    { new: true }
                )
                break;
            default:
                return res.status(400).json({ message: "Invalid type" });
        }
    } catch (error) {
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

const uploadDocuments = async (req, res) => {
    try {
        const { id, type } = req.params;
        const file = req.file; // Get file from request

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload PDF to Firebase Storage
        const fileUrl = await upload(file.buffer, file.originalname, "pdf");

        // Define update object based on user type
        let updatedUser;
        if (type === 'seller') {
            updatedUser = await sellerModel.findByIdAndUpdate(
                id,
                { $set: { documents: fileUrl } },
                { new: true }
            );
        } else if (type === 'advertiser') {
            updatedUser = await advertiserModel.findByIdAndUpdate(
                id,
                { $set: { documents: fileUrl } },
                { new: true }
            );
        } else if (type === 'tourGuide') {
            updatedUser = await tourGuideModel.findByIdAndUpdate(
                id,
                { $set: { documents: fileUrl } },
                { new: true }
            );
        } else {
            return res.status(400).json({ message: 'Invalid user type' });
        }

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Document uploaded and user updated successfully',
            documents: fileUrl,
        });
    } catch (error) {
        console.error('Error uploading documents:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }

}

const uploadProfilePicture = async (req, res) => {
    try {
        const { id, type } = req.params;
        const file = req.file; // Get file from request

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload image to Firebase Storage
        const fileUrl = await upload(file.buffer, file.originalname, "image");

        // Define update object based on user type
        let updatedUser;
        if (type === 'seller') {
            updatedUser = await sellerModel.findByIdAndUpdate(
                id,
                { $set: { profilePicture: fileUrl } },
                { new: true }
            );
        } else if (type === 'advertiser') {
            updatedUser = await advertiserModel.findByIdAndUpdate(
                id,
                { $set: { profilePicture: fileUrl } },
                { new: true }
            );
        } else if (type === 'tourGuide') {
            updatedUser = await tourGuideModel.findByIdAndUpdate(
                id,
                { $set: { profilePicture: fileUrl } },
                { new: true }
            );
        } else if (type === 'tourist') {
            updatedUser = await touristModel.findByIdAndUpdate(
                id,
                { $set: { profilePicture: fileUrl } },
                { new: true }
            );
        } else {
            return res.status(400).json({ message: 'Invalid user type' });
        }

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Profile picture uploaded and user updated successfully',
            profilePicture: fileUrl,
        });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}


async function upload(fileBuffer, fileName, type) {
    try {
        // Generate a unique file name
        const uniqueFileName = `${uuidv4()}-${fileName}`;

        // Detect the MIME type from the file buffer
        const fileType = await fileTypeFromBuffer(fileBuffer);

        if (!fileType) {
            throw new Error('Could not determine the file type');
        }

        // Create a reference to the file in Firebase Storage
        const file = firebase.bucket.file(uniqueFileName);

        // Upload the file buffer to Firebase Storage with the detected content type
        await file.save(fileBuffer, {
            metadata: {
                contentType: fileType.mime, // Use detected MIME type
            },
        });

        // Make the file publicly accessible
        await file.makePublic();

        // Return the public URL
        const fileUrl = `https://storage.googleapis.com/${firebase.bucket.name}/${uniqueFileName}`;
        return fileUrl;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('Failed to upload file to Firebase');
    }
}

export default {
    changePassword,
    uploadDocuments,
    uploadProfilePicture
}