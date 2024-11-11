// product.js (Using ES Modules)
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Picture: {
    type: String,
    required: false,
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
  Archive: {
    type : Boolean,
    required :false,
    default: false,  
  },
  Sales:{
    type: Number,
    default:0,
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
