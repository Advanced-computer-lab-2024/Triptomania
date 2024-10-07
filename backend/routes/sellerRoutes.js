import sellerController from "../controllers/seller/sellerController.js";
import productController from '../controllers/shared/productController.js';
import express from 'express'
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/addSeller', sellerController.CreateSeller);

router.put('/updateSeller', sellerController.updateSeller);

router.get('/getSeller', sellerController.getSeller);

router.post("/product/addProduct",productController.addProduct);
router.put("/product/editProduct/:id",productController.editProduct);
router.get("/product/viewProducts",productController.viewProducts);
router.get("/product/searchProducts",productController.searchProduct);
router.get("/product/filterProducts",productController.filterProducts);
router.get("/product/sortProducts",productController.sortProducts);
router.post("/product/uploadPicture/:id", upload.single('file'), productController.uploadPicture);

export default router;
