// product.js (Using ES Modules)
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new Schema({
  Description: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Seller: {
    type: String,
    required: true,
  },
  Ratings: {
    type: Number,
    required: true,
 
  },
  Reviews: {
    type: [String], // Array of strings
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
