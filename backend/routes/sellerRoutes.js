//import { addProduct } from './controllers/shared/productController.js';
//import { editProduct } from './controllers/shared/productController.js';
import sellerController from "../controllers/seller/sellerController.js";
import express from 'express'


const routes = express.Router();

routes.post('/addSeller', sellerController.CreateSeller);

routes.put('/updateSeller', sellerController.updateSeller);

routes.get('/getSeller', sellerController.getSeller);

export default routes;
