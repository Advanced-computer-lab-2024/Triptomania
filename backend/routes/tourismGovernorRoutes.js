import express from 'express';
import historicalPlaceController from '../controllers/tourismGovernor/historicalPlaceController.js';
import tourismGovernor from '../controllers/tourismGovernor/tourismGovernorController.js';
import sharedController from '../controllers/shared/sharedController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Tourism Governor
 *     description: All tourismGovernor-related endpoints
 */

/**
 * @swagger
 * /api/tourismGovernor/getHistoricalPlaces:
 *   get:
 *     summary: Get all historical places
 *     tags: [Tourism Governor]
 *     responses:
 *       200:
 *         description: List of all historical places
 */
router.get('/getHistoricalPlaces', historicalPlaceController.getHistoricalPlaces);

/**
 * @swagger
 * /api/tourismGovernor/getHistoricalPlace/{id}:
 *   get:
 *     summary: Get a specific historical place by ID
 *     tags: [Tourism Governor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the historical place to retrieve
 *     responses:
 *       200:
 *         description: Details of the historical place
 */
router.get('/getHistoricalPlace/:id', historicalPlaceController.getHistoricalPlace);

/**
 * @swagger
 * /api/tourismGovernor/addHistoricalPlace:
 *   post:
 *     summary: Add a new historical place
 *     tags: [Tourism Governor]
 *     responses:
 *       200:
 *         description: Historical place added successfully
 */
router.post('/addHistoricalPlace', historicalPlaceController.addHistoricalPlace);

/**
 * @swagger
 * /api/tourismGovernor/editHistoricalPlace/{id}:
 *   put:
 *     summary: Edit a historical place
 *     tags: [Tourism Governor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the historical place to edit
 *     responses:
 *       200:
 *         description: Historical place updated successfully
 */
router.put('/editHistoricalPlace/:id', historicalPlaceController.editHistoricalPlace);

/**
 * @swagger
 * /api/tourismGovernor/getMyHistoricalPlaces/{creatorId}:
 *   get:
 *     summary: Get historical places created by a specific user
 *     tags: [Tourism Governor]
 *     parameters:
 *       - in: path
 *         name: creatorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Creator ID to filter historical places
 *     responses:
 *       200:
 *         description: List of historical places created by the user
 */
router.get('/getMyHistoricalPlaces/:creatorId', historicalPlaceController.getMyHistoricalPlaces);

/**
 * @swagger
 * /api/tourismGovernor/deleteHistoricalPlace/{id}:
 *   delete:
 *     summary: Delete a historical place
 *     tags: [Tourism Governor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the historical place to delete
 *     responses:
 *       200:
 *         description: Historical place deleted successfully
 */
router.delete('/deleteHistoricalPlace/:id', historicalPlaceController.deleteHistoricalPlace);

/**
 * @swagger
 * /api/tourismGovernor/addTagToHistoricalPlace/{id}:
 *   put:
 *     summary: Add a tag to a historical place
 *     tags: [Tourism Governor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the historical place to tag
 *     responses:
 *       200:
 *         description: Tag added to historical place successfully
 */
router.put('/addTagToHistoricalPlace/:id', tourismGovernor.addTagToHistoricalPlace);

/**
 * @swagger
 * /api/tourismGovernor/addTag:
 *   post:
 *     summary: Add a new tag
 *     tags: [Tourism Governor]
 *     responses:
 *       200:
 *         description: Tag added successfully
 */
router.post('/addTag', tourismGovernor.addTag);

/**
 * @swagger
 * /api/tourismGovernor/getTags:
 *   get:
 *     summary: Get all tags
 *     tags: [Tourism Governor]
 *     responses:
 *       200:
 *         description: List of all tags
 */
router.get('/getTags', tourismGovernor.getTags);

/**
 * @swagger
 * /api/tourismGovernor/deleteTag/{id}:
 *   delete:
 *     summary: Delete a tag
 *     tags: [Tourism Governor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tag to delete
 *     responses:
 *       200:
 *         description: Tag deleted successfully
 */
router.delete('/deleteTag/:id', tourismGovernor.deleteTag);

/**
 * @swagger
 * /api/tourismGovernor/updateTag:
 *   put:
 *     summary: Update an existing tag
 *     tags: [Tourism Governor]
 *     responses:
 *       200:
 *         description: Tag updated successfully
 */
router.put('/updateTag', tourismGovernor.updateTag);

router.put('/changePassword/:id/:type', sharedController.changePassword);

export default router;
