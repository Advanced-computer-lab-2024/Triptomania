import mongoose from 'mongoose';
import adminModel from '../../models/admin.js';
import touristModel from '../../models/tourist.js';
import tourismGovernorModel from '../../models/tourismGovernor.js';
import sellerModel from '../../models/seller.js';
import tourGuideModel from '../../models/tourGuide.js';
import advertiserModel from '../../models/advertiser.js';
import firebase from '../../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';
import { fileTypeFromBuffer } from 'file-type';

const userCollections = {
    admin: adminModel,
    advertiser: advertiserModel,
    seller: sellerModel,
    tourGuide: tourGuideModel,
    tourismGovernor: tourismGovernorModel,
    tourist: touristModel,
};

const uploadDocuments = async (req, res) => {
    try {
        const { id, type } = req.query;
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
        res.status(500).json({ message: 'Something went wrong' });
    }

}


const uploadProfilePicture = async (req, res) => {
    try {
        const { id, type } = req.query;
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
        throw new Error('Failed to upload file to Firebase');
    }
}

const acceptUser = async (req, res) => {
    try {
        
        const { type, id } = req.body;
       
        // Map user type to the corresponding model
        const userModels = {
            seller: sellerModel,
            advertiser: advertiserModel,
            tourGuide: tourGuideModel,
        };
    
        const UserModel = userModels[type];
       
    
        if (!UserModel) {
            return res.status(400).json({ message: 'Invalid user type' });
        }

        // Find and update the user status to 'accepted'
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { $set: { status: 'accepted' } },
            { new: true } // Return the updated document
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Success response
        res.status(200).json({
            message: 'User accepted successfully',
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

const rejectUser = async (req, res) => {
    try {
        
        const { type, id } = req.body;
       
        // Map user type to the corresponding model
        const userModels = {
            seller: sellerModel,
            advertiser: advertiserModel,
            tourGuide: tourGuideModel,
        };

        const UserModel = userModels[type];

        if (!UserModel) {
            return res.status(400).json({ message: 'Invalid user type' });
        }

        // Find and update the user status to 'rejected'
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { $set: { status: 'rejected' } },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Success response
        res.status(200).json({
            message: 'User rejected successfully',
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

const getPendingUsers = async (req, res) => {
    try {
        // Find all sellers with status "pending"
        const pendingSellers = await sellerModel.find({ status: 'pending' });

        // Find all advertisers with status "pending"
        const pendingAdvertisers = await advertiserModel.find({ status: 'pending' });

        // Find all tour guides with status "pending"
        const pendingTourGuides = await tourGuideModel.find({ status: 'pending' });

        // Combine all the pending users into one array
        const pendingUsers = {
            sellers: pendingSellers,
            advertisers: pendingAdvertisers,
            tourGuides: pendingTourGuides
        };

        // Send the response with all the pending users
        res.status(200).json({
            message: 'Pending users retrieved successfully',
            pendingUsers
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};


const acceptTerms = async (req, res) => {
    try {
        // Extract id and type from the route parameters
        const type = req.user.type;
        const id = req.user._id;

        // Trim any leading/trailing spaces from the ID
        const trimmedId = id.trim();

        // Validate if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        // Map user type to the corresponding model
        const userModels = {
            seller: sellerModel,
            advertiser: advertiserModel,
            tourGuide: tourGuideModel,
        };

        const UserModel = userModels[type];

        if (!UserModel) {
            return res.status(400).json({ message: 'Invalid user type' });
        }

        // Find and update the user to set 'acceptedTerms' to true
        const updatedUser = await UserModel.findByIdAndUpdate(
            trimmedId,
            { $set: { acceptedTerms: true } },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Success response
        res.status(200).json({
            message: 'Terms accepted successfully',
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
            error: error.message,
            stack: error.stack,
        });
    }
};

const requestAccountDeletion = async (req, res) => {
    try {
        const id = req.user._id;

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
                    } else {
                        account = await tourismGovernorModel.findById(id);
                        if (account) {
                            accountModel = tourismGovernorModel;
                        }
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
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

const saveFCMToken = async (req, res) => {
    try {
        const type = req.user.type;
        const userId = req.user._id;

        const { token } = req.body;

        const userModel = userCollections[type];

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.fcmToken = token;
        await user.save();

        res.status(200).json({ message: 'Token saved successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const updateUser = async (req, res) => {
    try {
        const type = req.user.type;
        const userId = req.user._id;

        const userModel = userCollections[type];

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ user: user });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const getNotifications = async (req, res) => {
    try {
        const type = req.user.type;
        const userId = req.user._id;

        const userModel = userCollections[type];

        const user = await userModel.findById(userId).populate({ path: 'notifications.id', select: 'title body' });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ notifications: user.notifications });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const readNotification = async (req, res) => {
    try {
        const type = req.user.type;
        const userId = req.user._id;
        const { notificationId } = req.body;

        const userModel = userCollections[type];

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const notification = user.notifications.id(notificationId);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        notification.read = true;
        await user.save();

        return res.status(200).json({ message: 'Notification marked as read' });

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export default {
    uploadDocuments,
    uploadProfilePicture,
    acceptUser,
    rejectUser,
    getPendingUsers,
    acceptTerms,
    requestAccountDeletion,
    saveFCMToken,
    updateUser,
    getNotifications,
    readNotification
}
