import express from 'express';
import itineraryController from '../controllers/shared/itineraryController.js';

const router = express.Router();

router.post("/itinerary/addItinerary", itineraryController.addItinerary);
router.put("/itinerary/editItinerary/:id", itineraryController.editItinerary);
router.get("/itinerary/getItinerary", itineraryController.getItinerary);
router.delete("/itinerary/deleteItinerary/:id", itineraryController.deleteItinerary);

export default router;