import express from 'express';
import productController from '../controllers/shared/productController.js';


const router = express.Router();


router.post("/product/addProduct",productController.addProduct);
router.put("/product/editProduct",productController.editProduct);
router.get("/product/viewProducts",productController.viewProducts);
router.get("/product/searchProducts",productController.searchProduct);
router.get("/product/filterProducts",productController.filterProducts);
router.get("/product/sortProducts",productController.sortProducts);

export default router;

