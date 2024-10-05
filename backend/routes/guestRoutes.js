import express from 'express';
import { viewUpcoming } from '../controllers/shared/viewController.js'; // Adjust path as necessary
import{ filterByTag } from '../controllers/shared/filterController.js';

const router = express.Router();

// Define the route for viewing upcoming activities, itineraries, and historical places
router.get('/upcoming', viewUpcoming);
router.get('/filterByTag', filterByTag);
export default router;
