import express from 'express'
import touristController from '../controllers/tourist/touristController.js';


const router = express.Router();

router.post('/addTourist', touristController.CreateTourist);
router.put('/updateTourist', touristController.UpdateTourist);
router.get('/getTourist', touristController.getTourist);
router.get('/getOneTourist', touristController.getOneTourist);

export default router;