import express from 'express';
import search from '../controllers/tourist/searchController.js';
import viewUpcoming from '../controllers/shared/viewController.js';
import filterByTag from '../controllers/shared/filterController.js';
import touristController from '../controllers/tourist/touristController.js';
import productController from '../controllers/shared/productController.js';
import itineraryController from '../controllers/shared/itineraryController.js';
import activityController from '../controllers/shared/activityController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Tourist 
 *     description: All tourist-related endpoints
 */

/**
 * @swagger
 * /api/tourist/search:
 *   post:
 *     summary: Search for specific items
 *     tags: [Tourist]
 *     responses:
 *       200:
 *         description: Search results based on the query
 */
router.post('/search', search.search);

/**
 * @swagger
 * /api/tourist/upcoming:
 *   get:
 *     summary: View upcoming activities
 *     tags: [Tourist]
 *     responses:
 *       200:
 *         description: List of upcoming activities
 */
router.get('/upcoming', viewUpcoming.viewUpcoming);

/**
 * @swagger
 * /api/tourist/filterByTag:
 *   get:
 *     summary: Filter items by tags
 *     tags: [Tourist]
 *     responses:
 *       200:
 *         description: Filtered results by tags
 */
router.get('/filterByTag', filterByTag.filterByTag);

/**
 * @swagger
 * /api/tourist/itineraries/filterItineraries:
 *   get:
 *     summary: Filter itineraries
 *     tags: [Tourist]
 *     responses:
 *       200:
 *         description: Filtered list of itineraries
 */
router.get('/filterItineraries', itineraryController.filterItineraries);

/**
 * @swagger
 * /api/tourist/itineraries/sortItineraries:
 *   get:
 *     summary: Sort itineraries
 *     tags: [Tourist]
 *     responses:
 *       200:
 *         description: Sorted list of itineraries
 */
router.get('/itineraries/sortItineraries', itineraryController.sortItineraries);

/**
 * @swagger
 * /api/tourist/addTourist:
 *   post:
 *     summary: Add a new tourist
 *     tags: [Tourist]
 *     responses:
 *       200:
 *         description: Tourist added successfully
 */
router.post('/addTourist', touristController.CreateTourist);

router.put('/redeem/:id', touristController.redeemPoints);

router.get('/chooseCategory/:id', touristController.chooseCategory);

router.put('/bookActivity/:activityId', touristController.bookActivity);

router.put('/bookItinerary/:itineraryId', touristController.bookItinerary);

router.put('/badge/:_id', touristController.badge);

/**
 * @swagger
 * /api/tourist/updateTourist:
 *   put:
 *     summary: Update tourist information
 *     tags: [Tourist]
 *     responses:
 *       200:
 *         description: Tourist updated successfully
 */
router.put('/updateTourist', touristController.UpdateTourist);

/**
 * @swagger
 * /api/tourist/getTourist:
 *   get:
 *     summary: Get all tourists
 *     tags: [Tourist]
 *     responses:
 *       200:
 *         description: List of all tourists
 */
router.get('/getTourist', touristController.getTourist);

/**
 * @swagger
 * /api/tourist/getOneTourist:
 *   get:
 *     summary: Get details of a specific tourist
 *     tags: [Tourist]
 *     responses:
 *       200:
 *         description: Details of the specified tourist
 */
router.get('/getOneTourist', touristController.getOneTourist);

/**
 * @swagger
 * /api/tourist/activity/sortActivities:
 *   get:
 *     summary: Sort activities
 *     tags: [Tourist]
 *     responses:
 *       200:
 *         description: Sorted list of activities
 */
router.get("/activity/sortActivities", activityController.sortActivities);

/**
 * @swagger
 * /api/tourist/activity/viewActivities:
 *   get:
 *     summary: View all activities
 *     tags: [Tourist]
 *     responses:
 *       200:
 *         description: List of all activities
 */
router.get("/activity/viewActivities", activityController.viewActivities);

/**
 * @swagger
 * /api/tourist/activity/filterActivities:
 *   get:
 *     summary: Filter activities
 *     tags: [Tourist]
 *     responses:
 *       200:
 *         description: Filtered list of activities
 */
router.get("/activity/filterActivities", activityController.filterActivities);

/**
 * @swagger
 * /api/tourist/product/viewProducts:
 *   get:
 *     summary: View all products
 *     tags: [Tourist]
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get("/product/viewProducts", productController.viewProducts);

/**
 * @swagger
 * /api/tourist/product/searchProducts:
 *   get:
 *     summary: Search for products
 *     tags: [Tourist]
 *     responses:
 *       200:
 *         description: Search results for products
 */
router.get("/product/searchProducts", productController.searchProduct);

/**
 * @swagger
 * /api/tourist/product/filterProducts:
 *   get:
 *     summary: Filter products
 *     tags: [Tourist]
 *     responses:
 *       200:
 *         description: Filtered list of products
 */
router.get("/product/filterProducts", productController.filterProducts);

/**
 * @swagger
 * /api/tourist/product/sortProducts:
 *   get:
 *     summary: Sort products
 *     tags: [Tourist]
 *     responses:
 *       200:
 *         description: Sorted list of products
 */
router.get("/product/sortProducts", productController.sortProducts);
/**
 * @swagger
 * /api/tourist/rateTourGuide/{touristId}:
 *   post:
 *     summary: Rate a tour guide after completing a tour
 *     tags: [Tourist]
 *     parameters:
 *       - in: path
 *         name: touristId
 *         required: true
 *         description: The ID of the tourist giving the rating
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itineraryId:
 *                 type: string
 *                 description: The ID of the itinerary for which the tour guide is being rated
 *               rating:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 5
 *                 description: The rating value (0 to 5)
 *     responses:
 *       200:
 *         description: Successfully rated the tour guide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rating submitted successfully."
 *                 averageRating:
 *                   type: number
 *                   format: float
 *                   description: The new average rating for the tour guide
 *       400:
 *         description: Invalid input, such as rating out of range or itinerary expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid rating value or itinerary has expired."
 *       404:
 *         description: Tour guide or itinerary not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tour guide or itinerary not found."
 */
router.put('/rateTourGuide/:touristId', touristController.rateTourGuide);


router.post("/comment/ :id", touristController.addComment);

router.post("/product/reviews/ :id", touristController.reviewProduct);

export default router;
