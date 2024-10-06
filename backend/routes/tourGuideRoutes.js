import express from 'express'
import tourGuideController from '../controllers/tourGuide/tourGuideController.js';

const router = express.Router();

router.post('/addTourguide', tourGuideController.CreateTourGuide);

router.put('/updateTourguide', tourGuideController.updateTourGuide);

router.get('/getTourguide', tourGuideController.getTourGuide);

export default router;