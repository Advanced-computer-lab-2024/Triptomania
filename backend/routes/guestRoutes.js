import express from 'express';
import itineraryController from '../controllers/shared/itineraryController.js';
import activityController from '../controllers/shared/activityController.js';
import historicalPlaceController from '../controllers/tourismGovernor/historicalPlaceController.js';
import filterController from '../controllers/shared/filterController.js';


const router = express.Router();

router.get('/itineraries/viewItineraries', itineraryController.viewItineraries);

router.get('/activities/viewActivities', activityController.viewActivities);

router.get('/historicalPlaces/getHistoricalPlaces', historicalPlaceController.getHistoricalPlaces);

router.get('/activities/filterActivities', activityController.filterActivities);

router.get('/activities/sortActivities', activityController.sortActivities);

router.get('/itineraries/filterItineraries', itineraryController.filterItineraries);

router.get('/historicalPlaces/filterHistoricalPlaces', filterController.filterByTag);

router.get('/activities/getActivity/:id', activityController.getActivity);

router.get('/itineraries/getItinerary/:id', itineraryController.getItinerary);

router.get('/historicalPlaces/getHistoricalPlace/:id', historicalPlaceController.getHistoricalPlace);

export default router;