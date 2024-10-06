import sellerController from "../controllers/seller/sellerController.js";
import productController from '../controllers/shared/productController.js';
import express from 'express'


const routes = express.Router();

routes.post('/addSeller', sellerController.CreateSeller);

routes.put('/updateSeller', sellerController.updateSeller);

routes.get('/getSeller', sellerController.getSeller);

router.post("/product/addProduct",productController.addProduct);
router.put("/product/editProduct",productController.editProduct);
router.get("/product/viewProducts",productController.viewProducts);
router.get("/product/searchProducts",productController.searchProduct);
router.get("/product/filterProducts",productController.filterProducts);
router.get("/product/sortProducts",productController.sortProducts);

export default router;
