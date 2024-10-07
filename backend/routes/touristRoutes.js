import express from 'express';
import productController from '../controllers/shared/productController.js';
import activityController from '../controllers/shared/activityController.js';


const router = express.Router();


router.get("/product/viewProducts",productController.viewProducts);
router.get("/product/searchProducts",productController.searchProduct);
router.get("/product/sortProducts",productController.sortProducts);


router.get("/activity/sortActivities",activityController.sortActivities);
router.get("/activity/viewActivities",activityController.viewActivities);
router.get("/activity/filterActivities",activityController.filterActivities);


router.get("/itineraries/sortItineraries" , activityController.sortItineraries);
router.get("/itineraries/filtertineraries" , activityController.filterItineraries);

export default router;