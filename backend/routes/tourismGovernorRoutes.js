import express from 'express';
import historicalPlaceController from '../controllers/tourismGovernor/historicalPlaceController.js';
import tourismGoverner from '../controllers/tourismGovernor/tourismGovernor.js';

const router = express.Router();

// get all historical places
router.get('/getHistoricalPlaces', historicalPlaceController.getHistoricalPlaces);
// add historical place
router.post('/addHistoricalPlace', historicalPlaceController.addHistoricalPlace);
// edit historical place
router.put('/editHistoricalPlace/:id', historicalPlaceController.editHistoricalPlace);
// delete historical place
router.delete('/deleteHistoricalPlace/:id', historicalPlaceController.deleteHistoricalPlace);
router.put('/addTagToHistoricalPlace/:id', tourismGoverner.addTagToHistoricalPlace);
router.post('/addTag',tourismGoverner.addTag);
router.get('/getTags',tourismGoverner.getTags);
router.delete('/deleteTag/:id',tourismGoverner.deleteTag);
export default router;