import express from 'express';
import productController from '../controllers/shared/productController.js';


const router = express.Router();


router.get("/product/viewProducts",productController.viewProducts);


export default router;