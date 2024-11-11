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
router.post('/activities/addCategory', activityController.addCategory);

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
router.get('/activities/getCategories', activityController.getCategories);

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
router.put('/activities/editCategory/:id', activityController.editCategory);

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
router.delete('/activities/deleteCategory/:id', activityController.deleteCategory);

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
router.post('/tags/addPreferenceTag', preferenceTagController.addPreferenceTag);

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
router.get('/tags/getPreferenceTags', preferenceTagController.getPreferenceTags);

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
router.put('/tags/editPreferenceTag/:id', preferenceTagController.editPreferenceTag);

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
router.delete('/tags/deletePreferenceTag/:id', preferenceTagController.deletePreferenceTag);

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
router.post('/addAdmin', adminController.addAdmin);

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
router.delete('/deleteAccount', adminController.deleteAccount);

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
router.post('/addTourismGovernor', adminController.addTourismGovernor);

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
router.post("/product/addProduct", productController.addProduct);

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
router.put("/product/editProduct/:id", productController.editProduct);

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
router.get("/product/viewProducts", adminController.viewProductsAdmin);

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
router.get("/product/searchProducts", productController.searchProduct);

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
router.get("/product/filterProducts", productController.filterProducts);

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
router.get("/product/sortProducts", productController.sortProducts);

router.patch('/product/archive/:id', productController.toggleArchiveStatus); //minus swagger

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
router.get('/getTourists', touristController.getTourist);

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
router.get('/getSellers', sellerController.getSeller);

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
router.get('/getTourGuides', tourGuideController.getTourGuide);

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
router.get('/getAdvertisers', advertiserController.getAdvertiser);

router.put('/changePassword/:id/:type', sharedController.changePassword);


router.put('/acceptUser/:id/:type', sharedController.acceptUser);

router.put('/rejectUser/:id/:type', sharedController.rejectUser);

router.get('/pending-users', sharedController.getPendingUsers);

router.get('/complaints/viewComplaints',complaintsController.viewComplaints);
router.get('/complaints/viewComplaint/:id',complaintsController.viewComplaintDetails);
router.put('/complaints/updateStatus/:id',complaintsController.updateComplaintStatus);
router.get('/complaints/sortComplaints',complaintsController.sortComplaintsByDate);
router.get('/complaints/filterComplaints',complaintsController.filterComplaintsByStatus);
router.put('/complaints/replyToComplaint/:id',complaintsController.replyToComplaint);

router.get('/getusersrequestdelete',adminController.getUsers);
//router.delete('/deleteTouristAccount/:id',adminController.deleteTouristAccount)

router.put('/flagitinerary/:id',adminController.flagItinerary);

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
router.get("/itineraries/getItineraries/:id", itineraryController.viewItineraries);
export default router;
 