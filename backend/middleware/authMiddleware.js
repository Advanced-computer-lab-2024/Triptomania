// /middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import tokenBlacklistModel from "../models/tokenBlacklist.js";

dotenv.config();

const verifyToken = async (req, res, next, allowedRoles) => {
  // Retrieve the token from cookies
  const token = req.cookies?.token;

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Check if the token is blacklisted
    const blacklistedToken = await tokenBlacklistModel.findOne({ token: token });
    if (blacklistedToken) {
      return res.status(401).send("Invalid or expired token");
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
      }

      // Check if the user has the required role
      if (allowedRoles && !allowedRoles.includes(decoded.type)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient role' });
      }

      // Store decoded user info in the request object
      req.user = decoded;

      next();
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const checkBlacklistedToken = async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send("Token is required");
  }

  try {
    const blacklistedToken = await tokenBlacklistModel.findOne({ token: token });
    if (blacklistedToken) {
      return res.status(401).send("Invalid or expired token");
    }

    // Proceed to the next middleware if the token is not blacklisted
    next();
  } catch (err) {
    res.status(500).send("Server error");
  }
};

export default { verifyToken, checkBlacklistedToken };
