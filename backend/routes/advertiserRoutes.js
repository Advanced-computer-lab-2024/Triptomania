import express from 'express';
import advertiserController from '../controllers/advertiser/advertiserController.js';

const router = express.Router();

router.post('/addAdvertiser', advertiserController.createAdvertiser);
router.put('/updateAdvertiser', advertiserController.updateAdvertiser);
router.get('/getAdvertiser', advertiserController.getAdvertiser);

router.post("/activity/addActivity",advertiserController.addActivity);
router.put("/activity/editActivity/:id",advertiserController.editActivity);
router.get("/activity/viewActivities",advertiserController.viewActivities);
router.delete("/activity/deleteActivity/:id",advertiserController.deleteActvivty);
router.get("/activity/viewMyActivities/:creatorId", advertiserController.viewMyActivities);

export default router;
