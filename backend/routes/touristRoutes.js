import express from 'express';
import  search  from '../controllers/tourist/searchController.js';
import  viewUpcoming  from '../controllers/shared/viewController.js'; // Adjust path as necessary
import filterByTag from '../controllers/shared/filterController.js';
import filterItineraries from '../controllers/shared/activityController.js';
const router = express.Router();

// Search route
router.post('/search', search.search);
router.get('/upcoming', viewUpcoming.viewUpcoming);
router.get('/filterByTag', filterByTag.filterByTag);
router.get('/filterItineraries',filterItineraries.filterItineraries);
router.get('/sort',filterItineraries.sortItineraries);

export default router;