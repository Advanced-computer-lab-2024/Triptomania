import express from 'express'
import advertiserController from '../controllers/advertiser/advertiserController.js';

const router = express.Router();

router.post('/addAdvertiser', advertiserController.createAdvertiser);
router.put('/updateAdvertiser', advertiserController.updateAdvertiser);
router.get('/getAdvertiser', advertiserController.getAdvertiser);

export default router;