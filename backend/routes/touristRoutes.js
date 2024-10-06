import express from 'express'
import touristController from '../controllers/tourist/touristController.js';
import productController from '../controllers/shared/productController.js';

const router = express.Router();

router.post('/addTourist', touristController.CreateTourist);
router.put('/updateTourist', touristController.UpdateTourist);
router.get('/getTourist', touristController.getTourist);

router.get("/product/viewProducts",productController.viewProducts);
router.get("/product/searchProducts",productController.searchProduct);
router.get("/product/filterProducts",productController.filterProducts);
router.get("/product/sortProducts",productController.sortProducts);

export default router;