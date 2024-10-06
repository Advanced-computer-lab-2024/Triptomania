import express from 'express';
import itineraryController from '../controllers/shared/itineraryController.js';

const router = express.Router();

router.post("/itinerary/addItinerary", itineraryController.addItinerary);
router.put("/itinerary/editItinerary", itineraryController.editItinerary);
router.get("/itinerary/getItinerary", itineraryController.getItinerary);
router.delete("/itinerary/deleteItinerary", itineraryController.deleteItinerary);

export default router;