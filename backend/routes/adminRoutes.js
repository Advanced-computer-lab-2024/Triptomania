import express from 'express';
import activityController from '../controllers/shared/activityController.js';
import preferenceTagController from '../controllers/admin/preferenceTagController.js';
import adminController from '../controllers/admin/adminController.js';
import productController from '../controllers/shared/productController.js';
import touristController from '../controllers/tourist/touristController.js';
import tourGuideController from '../controllers/tourGuide/tourGuideController.js';
import sellerController from '../controllers/seller/sellerController.js';
import advertiserController from '../controllers/advertiser/advertiserController.js';
import sharedController from '../controllers/shared/sharedController.js';
import complaintsController from '../controllers/admin/complaintsController.js';
import itineraryController from '../controllers/shared/itineraryController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: All admin-related endpoints for managing activities, preference tags, users, and products
 */

/**
 * @swagger
 * /api/admin/activities/addCategory:
 *   post:
 *     summary: Add a new activity category
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Activity category added successfully
 */
router.post('/activities/addCategory', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), activityController.addCategory);

/**
 * @swagger
 * /api/admin/activities/getCategories:
 *   get:
 *     summary: Get all activity categories
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of activity categories
 */
router.get('/activities/getCategories', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), activityController.getCategories);

router.get('/activities/getActivities', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), activityController.viewActivities);

/**
 * @swagger
 * /api/admin/activities/editCategory/{id}:
 *   put:
 *     summary: Update an activity category
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the activity category to update
 *     responses:
 *       200:
 *         description: Activity category updated successfully
 */
router.put('/activities/editCategory', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), activityController.editCategory);

/**
 * @swagger
 * /api/admin/activities/deleteCategory/{id}:
 *   delete:
 *     summary: Delete an activity category
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the activity category to delete
 *     responses:
 *       200:
 *         description: Activity category deleted successfully
 */
router.delete('/activities/deleteCategory', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), activityController.deleteCategory);

/**
 * @swagger
 * /api/admin/tags/addPreferenceTag:
 *   post:
 *     summary: Add a new preference tag
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Preference tag added successfully
 */
router.post('/tags/addPreferenceTag', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), preferenceTagController.addPreferenceTag);

/**
 * @swagger
 * /api/admin/tags/getPreferenceTags:
 *   get:
 *     summary: Get all preference tags
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of preference tags
 */
router.get('/tags/getPreferenceTags', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), preferenceTagController.getPreferenceTags);

/**
 * @swagger
 * /api/admin/tags/editPreferenceTag/{id}:
 *   put:
 *     summary: Update a preference tag
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the preference tag to update
 *     responses:
 *       200:
 *         description: Preference tag updated successfully
 */
router.put('/tags/editPreferenceTag', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), preferenceTagController.editPreferenceTag);

/**
 * @swagger
 * /api/admin/tags/deletePreferenceTag/{id}:
 *   delete:
 *     summary: Delete a preference tag
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the preference tag to delete
 *     responses:
 *       200:
 *         description: Preference tag deleted successfully
 */
router.delete('/tags/deletePreferenceTag', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), preferenceTagController.deletePreferenceTag);

/**
 * @swagger
 * /api/admin/addAdmin:
 *   post:
 *     summary: Add a new admin to the system
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Admin added successfully
 */
router.post('/addAdmin', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), adminController.addAdmin);

/**
 * @swagger
 * /api/admin/deleteAccount:
 *   delete:
 *     summary: Delete an account
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Account deleted successfully
 */
router.delete('/deleteAccount', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), adminController.deleteAccount);

/**
 * @swagger
 * /api/admin/addTourismGovernor:
 *   post:
 *     summary: Add a new tourism governor to the system
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Tourism governor added successfully
 */
router.post('/addTourismGovernor', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), adminController.addTourismGovernor);

/**
 * @swagger
 * /api/admin/product/addProduct:
 *   post:
 *     summary: Add a new product
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Product added successfully
 */
router.post("/product/addProduct", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), productController.addProduct);

/**
 * @swagger
 * /api/admin/product/editProduct/{id}:
 *   put:
 *     summary: Edit an existing product
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to edit
 *     responses:
 *       200:
 *         description: Product edited successfully
 */
router.put("/product/editProduct", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), productController.editProduct);

/**
 * @swagger
 * /api/admin/product/viewProducts:
 *   get:
 *     summary: View all products
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/product/viewProducts", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), adminController.viewProductsAdmin);

/**
 * @swagger
 * /api/admin/product/searchProducts:
 *   get:
 *     summary: Search for products
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Search results for products
 */
router.get("/product/searchProducts", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), productController.searchProduct);

/**
 * @swagger
 * /api/admin/product/filterProducts:
 *   get:
 *     summary: Filter products
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Filtered products list
 */
router.get("/product/filterProducts", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), productController.filterProducts);

/**
 * @swagger
 * /api/admin/product/sortProducts:
 *   get:
 *     summary: Sort products
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Sorted products list
 */
router.get("/product/sortProducts", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), productController.sortProducts);

router.patch('/product/archive', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), productController.toggleArchiveStatus); //minus swagger

/**
 * @swagger
 * /api/admin/getTourists:
 *   get:
 *     summary: Get all tourists
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of tourists
 */
router.get('/getTourists', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), touristController.getTourist);

/**
 * @swagger
 * /api/admin/getSellers:
 *   get:
 *     summary: Get all sellers
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of sellers
 */
router.get('/getSellers', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), sellerController.getSeller);

/**
 * @swagger
 * /api/admin/getTourGuides:
 *   get:
 *     summary: Get all tour guides
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of tour guides
 */
router.get('/getTourGuides', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), tourGuideController.getTourGuide);

/**
 * @swagger
 * /api/admin/getAdvertisers:
 *   get:
 *     summary: Get all advertisers
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of advertisers
 */
router.get('/getAdvertisers', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), advertiserController.getAdvertiser);

router.put(
    '/acceptUser',
    (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']),
    sharedController.acceptUser
);

router.put(
    '/rejectUser',
    (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']),
    sharedController.rejectUser
);

router.get(
    '/pending-users',
    (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']),
    sharedController.getPendingUsers
);

router.get('/complaints/viewComplaints', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), complaintsController.viewComplaints);
router.get('/complaints/viewComplaint', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), complaintsController.viewComplaintDetails);
router.put('/complaints/updateStatus', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), complaintsController.updateComplaintStatus);
router.get('/complaints/sortComplaints', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), complaintsController.sortComplaintsByDate);
router.get('/complaints/filterComplaints', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), complaintsController.filterComplaintsByStatus);
router.put('/complaints/replyToComplaint', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), complaintsController.replyToComplaint);

router.get('/getusersrequestdelete', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), adminController.getDeleteUsers);

router.put('/flagitinerary', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), adminController.flagItinerary);

/**
 * @swagger
 * /api/admin/itineraries/getItineraries:
 *   get:
 *     summary: Get a list of all itineraries
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of itineraries
 */
router.get("/itineraries/getItineraries", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), itineraryController.viewItineraries);


/**
 * @swagger
 * /api/seller/product/uploadPicture/{id}:
 *   post:
 *     summary: Upload a picture for a product
 *     tags: [Seller]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to upload a picture for
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product picture uploaded successfully
 */
router.post("/product/uploadPicture", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), upload.single('file'), productController.uploadPicture);

router.post("/addPromoCode", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), upload.single('file'), adminController.createPromoCode);

router.get('/getUsers', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), adminController.getUsers);

router.post('/saveFcmToken', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['admin']), sharedController.saveFCMToken);

export default router;
