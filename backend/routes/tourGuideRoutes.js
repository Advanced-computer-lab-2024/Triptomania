import express from 'express';
import itineraryController from '../controllers/shared/itineraryController.js';
import tourGuideController from '../controllers/tourGuide/tourGuideController.js';
import sharedController from '../controllers/shared/sharedController.js';
import reportsController from '../controllers/services/reportsController.js';
import multer from 'multer';
import authMiddleware from '../middleware/authMiddleware.js';
import preferenceTagController from '../controllers/admin/preferenceTagController.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });


const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Tour Guide
 *     description: Tour guide-related endpoints for managing tour guides
 */

/**
 * @swagger
 * /api/tourGuide/itinerary/addItinerary:
 *   post:
 *     summary: Add a new itinerary
 *     tags: [Tour Guide]
 *     responses:
 *       200:
 *         description: Itinerary added successfully
 */
router.post("/itinerary/addItinerary", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourGuide']), itineraryController.addItinerary);

/**
 * @swagger
 * /api/tourGuide/itinerary/editItinerary/{id}:
 *   put:
 *     summary: Edit an itinerary
 *     tags: [Tour Guide]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the itinerary to edit
 *     responses:
 *       200:
 *         description: Itinerary edited successfully
 */
router.put("/itinerary/editItinerary", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourGuide']), itineraryController.editItinerary);

/**
 * @swagger
 * /api/tourGuide/itinerary/getItinerary/{id}:
 *   get:
 *     summary: Get a specific itinerary by ID
 *     tags: [Tour Guide]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the itinerary to retrieve
 *     responses:
 *       200:
 *         description: Itinerary details
 */
router.get("/itinerary/getItinerary/:id", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourGuide']), itineraryController.getItinerary);



/**
 * @swagger
 * /api/tourGuide/itinerary/getItineraries:
 *   get:
 *     summary: Get a list of all itineraries
 *     tags: [Tour Guide]
 *     responses:
 *       200:
 *         description: List of itineraries
 */
router.get("/itinerary/viewItineraries", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourGuide']), itineraryController.viewItineraries);

/**
 * @swagger
 * /api/tourGuide/itinerary/getMyItineraries/{creatorId}:
 *   get:
 *     summary: Get itineraries created by a specific user
 *     tags: [Tour Guide]
 *     parameters:
 *       - in: path
 *         name: creatorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Creator ID to filter itineraries
 *     responses:
 *       200:
 *         description: List of itineraries created by the user
 */
router.get("/itinerary/getMyItineraries", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourGuide']), itineraryController.getMyItineraries);

/**
 * @swagger
 * /api/tourGuide/itinerary/deleteItinerary/{id}:
 *   delete:
 *     summary: Delete an itinerary
 *     tags: [Tour Guide]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the itinerary to delete
 *     responses:
 *       200:
 *         description: Itinerary deleted successfully
 */
router.delete("/itinerary/deleteItinerary", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourGuide']), itineraryController.deleteItinerary);

/**
 * @swagger
 * /api/tourGuide/addTourguide:
 *   post:
 *     summary: Add a new tour guide
 *     tags: [Tour Guide]
 *     responses:
 *       200:
 *         description: Tour guide added successfully
 */
router.post('/addTourguide', tourGuideController.CreateTourGuide);

/**
 * @swagger
 * /api/tourGuide/updateTourguide:
 *   put:
 *     summary: Update an existing tour guide
 *     tags: [Tour Guide]
 *     responses:
 *       200:
 *         description: Tour guide updated successfully
 */
router.put('/updateTourguide', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourGuide']), tourGuideController.updateTourGuide);

/**
 * @swagger
 * /api/tourGuide/getTourguide:
 *   get:
 *     summary: Retrieve information about a tour guide
 *     tags: [Tour Guide]
 *     responses:
 *       200:
 *         description: Tour guide information retrieved successfully
 */
router.get('/getTourguide', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourGuide']), tourGuideController.getTourGuide);

router.put('/uploadDocument', upload.single('file'), sharedController.uploadDocuments);

router.put('/uploadProfilePicture', upload.single('file'), sharedController.uploadProfilePicture);

router.put('/accept-terms', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourGuide']), sharedController.acceptTerms);

router.put('/activate/itinerary', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourGuide']), tourGuideController.toggleItineraryStatus);

router.put("/request/delete", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourGuide']), sharedController.requestAccountDeletion);

router.post('/saveFcmToken', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourGuide']), sharedController.saveFCMToken);

router.get('/getTouristCount', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourGuide']), reportsController.generateTouristCountPDF);

router.get('/generateSalesReport', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourGuide']), reportsController.generateRevenuePDF);

router.get('/tags/getPreferenceTags', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourGuide']), preferenceTagController.getPreferenceTags);

router.get('/getNotifications', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourGuide']), sharedController.getNotifications);

router.post('/readNotification', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourGuide']), sharedController.readNotification);

export default router;
