import express from 'express';
import  search  from '../controllers/tourist/searchController.js';
import  viewUpcoming  from '../controllers/shared/viewController.js'; // Adjust path as necessary
import filterByTag from '../controllers/shared/filterController.js';
import touristController from '../controllers/tourist/touristController.js';
import productController from '../controllers/shared/productController.js';

const router = express.Router();

// Search route
router.post('/search', search.search);
router.get('/upcoming', viewUpcoming.viewUpcoming);
router.get('/filterByTag', filterByTag.filterByTag);

router.post('/addTourist', touristController.CreateTourist);
router.put('/updateTourist', touristController.UpdateTourist);
router.get('/getTourist', touristController.getTourist);
router.get('/getOneTourist', touristController.getOneTourist);

router.get("/product/viewProducts",productController.viewProducts);
router.get("/product/searchProducts",productController.searchProduct);
router.get("/product/filterProducts",productController.filterProducts);
router.get("/product/sortProducts",productController.sortProducts);

export default router;