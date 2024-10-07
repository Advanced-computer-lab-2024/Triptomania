import express from 'express';
import {addItinerary,viewItineraries,editItinerary,deleteItinerary} from '../controllers/tourGuide/itineraryController.js';

const router = express.Router();

router.post("/itinerary/addItinerary", addItinerary);
router.get("/itinerary/viewItineraries", viewItineraries);
router.put("/itinerary/editItinerary/:id", editItinerary);
router.delete("/itinerary/deleteItinerary/:id", deleteItinerary);

export default router;
