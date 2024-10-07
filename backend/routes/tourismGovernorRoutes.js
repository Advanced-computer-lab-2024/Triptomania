import express from 'express';
import historicalPlaceController from '../controllers/tourismGovernor/historicalPlaceController.js';
import tourismGoverner from '../controllers/tourismGovernor/tourismGovernor.js';
import HistoricalPlace from '../models/historicalPlace.js';

const router = express.Router();

// get all historical places
router.get('/getHistoricalPlaces', historicalPlaceController.getHistoricalPlaces);
// get one historical place with id
router.get('/getHistoricalPlace/:id', historicalPlaceController.getHistoricalPlace);
// add historical place
router.post('/addHistoricalPlace', historicalPlaceController.addHistoricalPlace);
// edit historical place
router.put('/editHistoricalPlace/:id', historicalPlaceController.editHistoricalPlace);
// delete historical place
router.get('/getMyHistoricalPlaces/:creatorId', historicalPlaceController.getMyHistoricalPlaces);
router.delete('/deleteHistoricalPlace/:id', historicalPlaceController.deleteHistoricalPlace);
router.put('/addTagToHistoricalPlace/:id', tourismGoverner.addTagToHistoricalPlace);
router.post('/addTag',tourismGoverner.addTag);
router.get('/getTags',tourismGoverner.getTags);
router.delete('/deleteTag/:id',tourismGoverner.deleteTag);
router.put('/updateTag',tourismGoverner.updateTag)
export default router;