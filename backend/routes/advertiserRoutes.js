import express from 'express';
import advertiserController from '../controllers/advertiser/advertiserController.js';
import sharedController from '../controllers/shared/sharedController.js';
import multer from 'multer';
import authMiddleware from '../middleware/authMiddleware.js';
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Advertiser
 *     description: Advertiser-related endpoints for managing advertisers and activities
 */

/**
 * @swagger
 * /api/advertiser/addAdvertiser:
 *   post:
 *     summary: Add a new advertiser
 *     tags: [Advertiser]
 *     responses:
 *       200:
 *         description: Advertiser created successfully
 */
router.post('/addAdvertiser', advertiserController.createAdvertiser);

/**
 * @swagger
 * /api/advertiser/updateAdvertiser:
 *   put:
 *     summary: Update an existing advertiser
 *     tags: [Advertiser]
 *     responses:
 *       200:
 *         description: Advertiser updated successfully
 */
router.put('/updateAdvertiser', advertiserController.updateAdvertiser);

/**
 * @swagger
 * /api/advertiser/getAdvertiser:
 *   get:
 *     summary: Retrieve advertiser information
 *     tags: [Advertiser]
 *     responses:
 *       200:
 *         description: Advertiser retrieved successfully
 */
router.get('/getAdvertiser', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['advertiser']), advertiserController.getAdvertiser);

/**
 * @swagger
 * /api/advertiser/activity/addActivity:
 *   post:
 *     summary: Add a new activity by the advertiser
 *     tags: [Advertiser]
 *     responses:
 *       200:
 *         description: Activity added successfully
 */
router.post('/activity/addActivity', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['advertiser']), advertiserController.addActivity);

/**
 * @swagger
 * /api/advertiser/activity/editActivity/{id}:
 *   put:
 *     summary: Edit an existing activity
 *     tags: [Advertiser]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the activity to edit
 *     responses:
 *       200:
 *         description: Activity edited successfully
 */
router.put('/activity/editActivity/:id', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['advertiser']), advertiserController.editActivity);

/**
 * @swagger
 * /api/advertiser/activity/viewActivities:
 *   get:
 *     summary: View all activities
 *     tags: [Advertiser]
 *     responses:
 *       200:
 *         description: List of activities
 */
router.get('/activity/viewActivities', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['advertiser']), advertiserController.viewActivities);

/**
 * @swagger
 * /api/advertiser/activity/deleteActivity/{id}:
 *   delete:
 *     summary: Delete an activity
 *     tags: [Advertiser]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the activity to delete
 *     responses:
 *       200:
 *         description: Activity deleted successfully
 */
router.delete('/activity/deleteActivity/:id', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['advertiser']), advertiserController.deleteActvivty);

/**
 * @swagger
 * /api/advertiser/activity/viewMyActivities/{creatorId}:
 *   get:
 *     summary: View activities created by a specific advertiser
 *     tags: [Advertiser]
 *     parameters:
 *       - in: path
 *         name: creatorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the advertiser to view activities for
 *     responses:
 *       200:
 *         description: List of activities created by the advertiser
 */
router.get('/activity/viewMyActivities/:creatorId', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['advertiser']), advertiserController.viewMyActivities);

router.put('/changePassword/:id/:type', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['advertiser']), sharedController.changePassword);

router.put('/uploadDocument/:id/:type', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['advertiser']), upload.single('file'), sharedController.uploadDocuments);

router.put('/accept-terms/:type/:id', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['advertiser']), sharedController.acceptTerms);

router.put("/request/delete", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['advertiser']), sharedController.requestAccountDeletion);

router.post('/saveFcmToken', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['advertiser']), sharedController.saveFCMToken);

export default router;
