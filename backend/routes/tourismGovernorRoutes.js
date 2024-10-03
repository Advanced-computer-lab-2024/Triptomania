import express from 'express';
import historicalPlaceController from '../controllers/tourismGovernor/historicalPlaceController.js';
const router = express.Router();

router.get('/getHistoricalPlaces', historicalPlaceController.getHistoricalPlaces);

export default router