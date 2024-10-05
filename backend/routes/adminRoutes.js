import express from 'express';
import productController from '../controllers/shared/productController.js';


const router = express.Router();


router.post("/product/addProduct",productController.addProduct);
router.put("/product/editProduct",productController.editProduct);
router.get("/product/viewProducts",productController.viewProducts);

export default router;

