import express from 'express';
import itineraryController from '../controllers/shared/itineraryController.js';

const router = express.Router();

router.post("/itinerary/addItinerary", itineraryController.addItinerary);
router.put("/itinerary/editItinerary/:id", itineraryController.editItinerary);
router.get("/itinerary/getItinerary/:id", itineraryController.getItinerary);
router.get("/itinerary/getItineraries", itineraryController.getItineraries);
router.delete("/itinerary/deleteItinerary/:id", itineraryController.deleteItinerary);

export default router;