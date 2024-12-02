import express from 'express';
import search from '../controllers/tourist/searchController.js';
import viewUpcoming from '../controllers/shared/viewController.js';
import filterByTag from '../controllers/shared/filterController.js';
import touristController from '../controllers/tourist/touristController.js';
import productController from '../controllers/shared/productController.js';
import itineraryController from '../controllers/shared/itineraryController.js';
import activityController from '../controllers/shared/activityController.js';
import historicalPlaceController from '../controllers/tourismGovernor/historicalPlaceController.js';
import sharedController from '../controllers/shared/sharedController.js';
import paymentController from '../controllers/services/paymentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

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
router.post('/search', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), search.search);

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
router.get('/upcoming', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), viewUpcoming.viewUpcoming);

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
router.get('/filterByTag', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), filterByTag.filterByTag);

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
router.get('/filterItineraries', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), itineraryController.filterItineraries);

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
router.get('/itineraries/sortItineraries', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), itineraryController.sortItineraries);

/**
 * @swagger
 * /api/tourist/itinerary/getItineraries:
 *   get:
 *     summary: Get a list of all itineraries
 *     tags: [Tourist]
 *     responses:
 *       200:
 *         description: List of itineraries
 */
router.get("/itineraries/getItineraries", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), itineraryController.getItineraries);

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

router.put('/redeem', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.redeemPoints);

router.get('/chooseCategory', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.chooseCategory);

router.put('/bookActivity', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.bookActivity);

router.put('/bookItinerary', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.bookItinerary);

router.put('/badge', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.badge);

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
router.put('/updateTourist', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.UpdateTourist);

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
router.get('/getTourist', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.getTourist);

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
router.get('/getOneTourist', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.getOneTourist);

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
router.get("/activity/sortActivities", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), activityController.sortActivities);

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
router.get("/activity/viewActivities", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), activityController.viewActivities);

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
router.get("/activity/filterActivities", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), activityController.filterActivities);

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
router.get("/product/viewProducts", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), productController.viewProducts);

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
router.get("/product/searchProducts", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), productController.searchProduct);

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
router.get("/product/filterProducts", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), productController.filterProducts);

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
router.get("/product/sortProducts", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), productController.sortProducts);
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
router.put('/rateTourGuide', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.rateTourGuide);
/**
 * @swagger
 * /api/tourist/rateItinerary/{touristId}:
 *   put:
 *     summary: Rate an itinerary after completing the tour
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
 *                 description: The ID of the itinerary being rated
 *               rating:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 5
 *                 description: The rating value (0 to 5)
 *     responses:
 *       200:
 *         description: Successfully rated the itinerary
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
 *                   description: The new average rating for the itinerary
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
 *         description: Itinerary not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Itinerary not found."
 */

router.put('/rateItinerary', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.rateItinerary);

router.put('/rateActivity', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.rateActivity);//youssef

router.put('/processPayment', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.processPayment);

router.put('/rateProduct', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.rateProduct);

router.post("/comment", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.addComment);

router.post("/product/reviews", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.reviewProduct);

router.post('/complaint/addComplaint', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.fileComplaint);

router.get('/complaint/viewMyComplaints', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.viewMyComplaints);

router.put('/selectTouristPreferences', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.choosePreferences);

router.put('/cancelBooking', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.cancelBooking);

router.get('/activities/getActivities', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), activityController.viewActivities);

router.get('/activities/getActivity', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), activityController.getActivity);

router.get('/itineraries/getItineraries', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), itineraryController.getItineraries);

router.get('/itineraries/viewItineraries', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), itineraryController.viewItineraries);

router.get('/itineraries/getItinerary', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), itineraryController.getItinerary);

router.get('/getHistoricalPlaces', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), historicalPlaceController.getHistoricalPlaces);

router.get('/getHistoricalPlace', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), historicalPlaceController.getHistoricalPlace);

router.get('/getHotels', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.getHotels);

router.get('/getHotelOffers', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.getHotelOffers);

router.post('/bookHotel', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.bookHotel)

router.post('/searchFlights', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.searchFlights);

router.get('/getFlightDetails', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.getFlightDetails);

router.post('/bookFlight', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.bookFlight);

router.post('/bookTransportation', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.bookTransportation);

router.put("/request/delete", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), sharedController.requestAccountDeletion);

router.post("/cart/checkoutCart", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), paymentController.checkoutCart);

router.post("/orders/cancelOrder", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), paymentController.cancelOrder);

router.post("/cart/addProduct", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.addProductToCart);

router.post("/cart/removeProduct", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.removeProductFromCart);

router.post("/cart/changeQuantity", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.changeCartQuantity);

router.put("/addDeliveryAddress", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.addDeliveryAdress);

router.post('/saveFcmToken', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), sharedController.saveFCMToken);

router.get('/orders/viewOrders', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.viewOrders);

router.get('/orders/viewOrderDetails', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.viewOrderDetails);

router.get('/cart/getCart', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.getCart);

router.get('/wishlist/getWishlist', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.getWishlist);

router.post('/wishlist/addProduct', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.addProductToWishlist);

router.post('/wishlist/removeProduct', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.removeProductFromWishlist);

router.post('/events/payForEvent', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), paymentController.payForEvent);

router.post('/events/cancelEvent', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), paymentController.cancelEvent);

router.get('/getUpcomingActivities', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.getUpcomingActivities);

router.get('/getUpcomingItineraries', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.getUpcomingItineraries);

router.get('/getPastActivities', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.getPastActivities);

router.get('/getPastItineraries', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.getPastItineraries);

router.post('/events/bookmarkEvent', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.bookmarkEvent);

router.get('/events/getBookmarkedEvents', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.getBookmarkedEvents);

router.put('/events/unbookmarkEvent', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['tourist']), touristController.unbookmarkEvent);

export default router;
