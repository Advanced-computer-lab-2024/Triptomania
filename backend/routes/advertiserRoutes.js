import express from 'express'
import advertiserController from '../controllers/advertiser/advertiserController.js';

const router = express.Router();

router.post('/addAdvertiser', advertiserController.createAdvertiser);
router.put('/updateAdvertiser', advertiserController.updateAdvertiser);
router.get('/getAdvertiser', advertiserController.getAdvertiser);

router.post("/activity/addActivivty",advertiserController.addActivity);
router.put("/activity/editActivivty",advertiserController.editActivity);
router.get("/activity/viewActivivties",advertiserController.viewActivities);
//router.put("/activity/deleteActivivty",advertiserController.deleteActivity);

export default router;