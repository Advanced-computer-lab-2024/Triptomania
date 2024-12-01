import express from 'express';
import authController from '../controllers/services/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/refresh-token', authMiddleware.checkBlacklistedToken, authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/forgot-password', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin', 'advertiser', 'seller', 'tourGuide', 'tourismGovernor', 'tourist']), authController.forgotPassword);
router.post('/verifyOTP', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin', 'advertiser', 'seller', 'tourGuide', 'tourismGovernor', 'tourist']), authController.verifyOTP);
router.put('/changePassword', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin', 'advertiser', 'seller', 'tourGuide', 'tourismGovernor', 'tourist']), authController.changePassword);

export default router;