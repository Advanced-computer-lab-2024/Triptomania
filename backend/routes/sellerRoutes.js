import sellerController from "../controllers/seller/sellerController.js";
import productController from '../controllers/shared/productController.js';
import express from 'express';
import multer from "multer";

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
router.put('/updateSeller', sellerController.updateSeller);

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
router.get('/getSeller', sellerController.getSeller);

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
router.post("/product/addProduct", productController.addProduct);

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
router.put("/product/editProduct/:id", productController.editProduct);

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
router.get("/product/viewProducts", productController.viewProducts);

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
router.get("/product/searchProducts", productController.searchProduct);

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
router.get("/product/filterProducts", productController.filterProducts);

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
router.get("/product/sortProducts", productController.sortProducts);

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
router.post("/product/uploadPicture/:id", upload.single('file'), productController.uploadPicture);

export default router;
