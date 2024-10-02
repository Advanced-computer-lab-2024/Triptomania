import express from 'express';
import activityController from '../controllers/shared/activityController.js';  // Make sure this path is correct

const router = express.Router();

// add a new activity category
router.post('/activities/addCategory', activityController.addCategory);
// get all activity categories
router.get('/activities/getCategories', activityController.getCategories);
// update an activity category
router.put('/activities/editCategory/:id', activityController.editCategory);
// delete an actvity category
router.delete('/activities/deleteCategory/:id', activityController.deleteCategory);

export default router;
