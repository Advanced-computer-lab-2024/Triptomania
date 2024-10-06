import express from 'express';
import advertiserController from '../controllers/advertiser/advertiserController.js';


const router = express.Router();


router.post("/activity/addActivivty",advertiserController.addActivity);
router.put("/activity/editActivivty",advertiserController.editActivity);
router.get("/activity/viewActivivties",advertiserController.viewActivities);
router.delete("/activity/deleteActivivty",advertiserController.deleteActvivty);

export default router;

