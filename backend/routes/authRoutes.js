import express from 'express';
import authController from '../controllers/services/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/refresh-token', authMiddleware.checkBlacklistedToken, authController.refreshToken);
router.post('/logout', authController.logout);

export default router;