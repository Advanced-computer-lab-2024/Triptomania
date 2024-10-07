import express from 'express';
import advertiserController from '../controllers/advertiser/advertiserController.js';

const router = express.Router();

router.post("/activity/addActivity", advertiserController.addActivity); // Fixed spelling
router.put("/activity/editActivity/:id", advertiserController.editActivity); // Added :id for edit
router.get("/activity/viewActivities", advertiserController.viewActivities); // Fixed spelling
router.delete("/activity/deleteActivity/:id", advertiserController.deleteActivity); // Added :id for delete

export default router;
