import express from 'express';
import itineraryController from '../controllers/shared/itineraryController.js';
import tourGuideController from '../controllers/tourGuide/tourGuideController.js';

const router = express.Router();

router.post("/itinerary/addItinerary", itineraryController.addItinerary);
router.put("/itinerary/editItinerary/:id", itineraryController.editItinerary);
router.get("/itinerary/getItinerary/:id", itineraryController.getItinerary);
router.get("/itinerary/getItineraries", itineraryController.getItineraries);
router.get("/itinerary/getMyItineraries/:creatorId", itineraryController.getMyItineraries);
router.delete("/itinerary/deleteItinerary/:id", itineraryController.deleteItinerary);

router.post('/addTourguide', tourGuideController.CreateTourGuide);

router.put('/updateTourguide', tourGuideController.updateTourGuide);

router.get('/getTourguide', tourGuideController.getTourGuide);

export default router;