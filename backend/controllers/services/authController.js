import adminModel from '../../models/admin.js';
import touristModel from '../../models/tourist.js';
import tourismGovernorModel from '../../models/tourismGovernor.js';
import sellerModel from '../../models/seller.js';
import tourGuideModel from '../../models/tourGuide.js';
import advertiserModel from '../../models/advertiser.js';
import tokenBlacklistModel from '../../models/tokenBlacklist.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const userCollections = {
    admin: adminModel,
    advertiser: advertiserModel,
    seller: sellerModel,
    tourGuide: tourGuideModel,
    tourismGovernor: tourismGovernorModel,
    tourist: touristModel,
};

const login = async (req, res) => {
    const { username, password, type } = req.body;

    // Validate request body
    if (!username || !password || !type || !userCollections[type]) {
        return res.status(400).send("Invalid request");
    }

    const UserModel = userCollections[type];

    try {
        // Find user in the database
        const user = await UserModel.findOne({ username });
        if (!user) return res.status(404).send("User not found");

        // Verify password
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) return res.status(401).send("Invalid password");

        // Generate access token (2-hour expiry), including username, type, and user _id
        const token = jwt.sign(
            { username: user.username, type, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        // Generate refresh token (7-day expiry), including username, type, and user _id
        const refreshToken = jwt.sign(
            { username: user.username, type, _id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        // Send tokens
        res.status(200).send({ token, refreshToken });
    } catch (err) {
        res.status(500).send("Server error");
    }
}

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(403).send("Refresh token is required");
    }

    try {
        // Verify refresh token and decode it
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Issue a new access token using the decoded info
        const newToken = jwt.sign(
            { username: decoded.username, type: decoded.type, _id: decoded._id },
            process.env.JWT_SECRET,
            { expiresIn: "2h" } // Access token expires in 2 hours
        );

        res.status(200).send({ token: newToken });
    } catch (err) {
        res.status(401).send("Invalid or expired refresh token");
    }
}

// Logout function
const logout = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).send("Refresh token is required");
    }

    try {
        // Add the refresh token to the blacklist
        await tokenBlacklistModel.create({ token: token });

        // Respond with success
        res.status(200).send("Logged out successfully");
    } catch (err) {
        res.status(500).send("Server error");
    }
};

export default { login, refreshToken, logout };