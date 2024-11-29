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
import crypto from 'crypto';
import SibApiV3Sdk from 'sib-api-v3-sdk';

dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const transactionalEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

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

        // Generate access token (2-hour expiry)
        const token = jwt.sign(
            { username: user.username, type, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        // Generate refresh token (7-day expiry)
        const refreshToken = jwt.sign(
            { username: user.username, type, _id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        // Set tokens as cookies
        res.cookie('token', token, {
            httpOnly: true, // Makes cookie inaccessible to JavaScript on the client-side
            secure: process.env.NODE_ENV === 'production', // Ensures cookie is only sent over HTTPS in production
            maxAge: 2 * 60 * 60 * 1000, // 2 hours
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({ message: "Login successful" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

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

        // Set the new access token in cookies
        res.cookie('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 2 * 60 * 60 * 1000, // 2 hours
        });

        res.status(200).send({ message: "Token refreshed successfully" });
    } catch (err) {
        res.status(401).send("Invalid or expired refresh token");
    }
};

const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).send("Refresh token is required");
    }

    try {
        // Add the refresh token to the blacklist
        await tokenBlacklistModel.create({ token: refreshToken });

        // Clear cookies
        res.clearCookie('token');
        res.clearCookie('refreshToken');

        // Respond with success
        res.status(200).send({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).send("Server error");
    }
};

const forgotPassword = async (req, res) => {
    const { type, id } = req.params;

    // Validate type
    const userModel = userCollections[type];
    if (!userModel) return res.status(400).send('Invalid user type');

    try {
        // Check if the user exists
        const user = await userModel.findOne({ _id: id });
        if (!user) return res.status(404).send('User not found');

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Save OTP and expiration in the database
        user.resetToken = otp;
        user.resetTokenExpiration = Date.now() + 5 * 60 * 1000; // 5 minutes
        await user.save();

        console.log('OTP:', otp);
        console.log(user.email);

        const sender = {
            name: 'Triptomania',
            email: 'triptomania.app@gmail.com',
        };
    
        const recipients = [
            { email: user.email }
        ];
    
        const emailContent = {
            sender,
            to: recipients,
            templateId: 1, // Replace with your Brevo template ID
            params: { otp: otp }, // Replace 'otp' with the template variable name
        };

        const response = await transactionalEmailApi.sendTransacEmail(emailContent);
        console.log(response);
        res.status(200).send('Email sent successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

const verifyOTP = async (req, res) => {
    const { type, id } = req.params;
    const { otp } = req.body;
    const userModel = userCollections[type];
    if (!userModel) return res.status(400).send('Invalid user type');

    try {
        // Check if the user exists
        const user = await userModel.findOne({ _id: id });
        if (!user) return res.status(404).send('User not found');

        // Check if the OTP is correct
        if (user.resetToken !== otp) return res.status(401).send('Invalid OTP');
        if (user.resetTokenExpiration < Date.now()) return res.status(401).send('OTP has expired');
        // Reset the user's password
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.status(200).send('OTP verified successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

export default { login, refreshToken, logout, forgotPassword, verifyOTP };