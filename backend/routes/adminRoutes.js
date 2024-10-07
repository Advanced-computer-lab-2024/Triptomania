import express from 'express';
import activityController from '../controllers/shared/activityController.js';
import preferenceTagController from '../controllers/shared/preferenceTagController.js';
import adminController from '../controllers/admin/adminController.js';
import tourismGovernorController from '../controllers/tourismGovernor/tourismGovernorController.js';
import productController from '../controllers/shared/productController.js';

const router = express.Router();

// add a new activity category
router.post('/activities/addCategory', activityController.addCategory);
// get all activity categories
router.get('/activities/getCategories', activityController.getCategories);
// update an activity category
router.put('/activities/editCategory/:id', activityController.editCategory);
// delete an activity category
router.delete('/activities/deleteCategory/:id', activityController.deleteCategory);

// add a new preference tag
router.post('/tags/addPreferenceTag', preferenceTagController.addPreferenceTag);
// get all preference tags
router.get('/tags/getPreferenceTags', preferenceTagController.getPreferenceTags);
// update an preference tag
router.put('/tags/editPreferenceTag/:id', preferenceTagController.editPreferenceTag);
// delete an preference tag
router.delete('/tags/deletePreferenceTag/:id', preferenceTagController.deletePreferenceTag);

// add an admin in the system
router.post('/addAdmin', adminController.addAdmin);

// delete an account
router.delete('/deleteAccount', adminController.deleteAccount);

// add a tourism governer in the system
router.post('/addTourismGoverner', tourismGovernorController.addTourismGoverner);

router.post("/product/addProduct",productController.addProduct);
router.put("/product/editProduct/:id",productController.editProduct);
router.get("/product/viewProducts",productController.viewProducts);
router.get("/product/searchProducts",productController.searchProduct);
router.get("/product/filterProducts",productController.filterProducts);
router.get("/product/sortProducts",productController.sortProducts);

export default router;
