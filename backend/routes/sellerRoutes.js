//import { addProduct } from './controllers/shared/productController.js';
//import { editProduct } from './controllers/shared/productController.js';
import sellerController from "../controllers/seller/sellerController.js";
import express from 'express'


const router = express.Router();

router.post('/addSeller', sellerController.CreateSeller);

router.put('/updateSeller', sellerController.updateSeller);

router.get('/getSeller', sellerController.getSeller);

export default router;
