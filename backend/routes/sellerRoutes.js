import sellerController from "../controllers/seller/sellerController.js";
import productController from '../controllers/shared/productController.js';
import sharedController from '../controllers/shared/sharedController.js';
import express from 'express';
import multer from "multer";
import authMiddleware from '../middleware/authMiddleware.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Seller
 *     description: Seller-related endpoints for managing seller profiles
 */

/**
 * @swagger
 * /api/seller/addSeller:
 *   post:
 *     summary: Add a new seller
 *     tags: [Seller]
 *     responses:
 *       200:
 *         description: Seller created successfully
 */
router.post('/addSeller', sellerController.CreateSeller);

/**
 * @swagger
 * /api/seller/updateSeller:
 *   put:
 *     summary: Update an existing seller
 *     tags: [Seller]
 *     responses:
 *       200:
 *         description: Seller updated successfully
 */
router.put('/updateSeller', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['seller']), sellerController.updateSeller);

/**
 * @swagger
 * /api/seller/getSeller:
 *   get:
 *     summary: Retrieve seller information
 *     tags: [Seller]
 *     responses:
 *       200:
 *         description: Seller retrieved successfully
 */
router.get('/getSeller', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['seller']), sellerController.getSeller);

/**
 * @swagger
 * /api/seller/product/addProduct:
 *   post:
 *     summary: Add a new product
 *     tags: [Seller]
 *     responses:
 *       200:
 *         description: Product added successfully
 */
router.post("/product/addProduct", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['seller']), productController.addProduct);

/**
 * @swagger
 * /api/seller/product/editProduct/{id}:
 *   put:
 *     summary: Edit an existing product
 *     tags: [Seller]
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
router.put("/product/editProduct", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['seller']), productController.editProduct);

/**
 * @swagger
 * /api/seller/product/viewProducts:
 *   get:
 *     summary: View all products
 *     tags: [Seller]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/product/viewProducts", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['seller']), sellerController.viewProducts);

/**
 * @swagger
 * /api/seller/product/searchProducts:
 *   get:
 *     summary: Search for products
 *     tags: [Seller]
 *     responses:
 *       200:
 *         description: Search results for products
 */
router.get("/product/searchProducts", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['seller']), productController.searchProduct);

/**
 * @swagger
 * /api/seller/product/filterProducts:
 *   get:
 *     summary: Filter products
 *     tags: [Seller]
 *     responses:
 *       200:
 *         description: Filtered products list
 */
router.get("/product/filterProducts", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['seller']), productController.filterProducts);

/**
 * @swagger
 * /api/seller/product/sortProducts:
 *   get:
 *     summary: Sort products
 *     tags: [Seller]
 *     responses:
 *       200:
 *         description: Sorted products list
 */
router.get("/product/sortProducts", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['seller']), productController.sortProducts);

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
router.post("/product/uploadPicture", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['seller']), upload.single('file'), productController.uploadPicture);

router.put('/uploadDocument', upload.single('file'), sharedController.uploadDocuments);

router.put('/uploadProfilePicture', upload.single('file'), sharedController.uploadProfilePicture);

router.put('/accept-terms', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['seller']), sharedController.acceptTerms);


router.patch('/product/archive', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['seller']), productController.toggleArchiveStatus); //minus swagger

router.put("/request/delete", (req, res, next) => authMiddleware.verifyToken(req, res, next, ['seller']), sharedController.requestAccountDeletion);

router.post('/saveFcmToken', (req, res, next) => authMiddleware.verifyToken(req, res, next, ['seller']), sharedController.saveFCMToken);

export default router;
