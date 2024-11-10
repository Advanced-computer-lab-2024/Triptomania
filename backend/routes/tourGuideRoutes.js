import express from 'express';
import itineraryController from '../controllers/shared/itineraryController.js';
import tourGuideController from '../controllers/tourGuide/tourGuideController.js';
import sharedController from '../controllers/shared/sharedController.js';
import multer from 'multer';

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
router.post("/itinerary/addItinerary", itineraryController.addItinerary);

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
router.put("/itinerary/editItinerary/:id", itineraryController.editItinerary);

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
router.get("/itinerary/getItinerary/:id", itineraryController.getItinerary);

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
router.get("/itinerary/getItineraries", itineraryController.getItineraries);

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
router.get("/itinerary/getMyItineraries/:creatorId", itineraryController.getMyItineraries);

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
router.delete("/itinerary/deleteItinerary/:id", itineraryController.deleteItinerary);

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
router.put('/updateTourguide', tourGuideController.updateTourGuide);

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
router.get('/getTourguide', tourGuideController.getTourGuide);

router.put('/changePassword/:id/:type', sharedController.changePassword);

router.put('/uploadDocument/:id/:type', upload.single('file'), sharedController.uploadDocuments);

router.put('/accept-terms/:type/:id', sharedController.acceptTerms);


export default router;
