import express from 'express';
import historicalPlaceController from '../controllers/tourismGovernor/historicalPlaceController.js';
import { addTagToHistoricalPlace ,addTag,getTags} from '../controllers/tourismGovernor/tourismGovernor.js';

const router = express.Router();

// get all historical places
router.get('/getHistoricalPlaces', historicalPlaceController.getHistoricalPlaces);
// add historical place
router.post('/addHistoricalPlace', historicalPlaceController.addHistoricalPlace);
// edit historical place
router.put('/editHistoricalPlace/:id', historicalPlaceController.editHistoricalPlace);
// delete historical place
router.delete('/deleteHistoricalPlace/:id', historicalPlaceController.deleteHistoricalPlace);
router.put('/addTagToHistoricalPlace/:id', addTagToHistoricalPlace);
router.post('/addTag',addTag);
router.get('/getTags',getTags);
export default router;