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
    type: String,
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
  // Ratings should be an array of objects, remove the previous definition
  Reviews: {
    type: [String], // Array of strings for reviews
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
Rating: [{
        touristId: { type: mongoose.Types.ObjectId, ref: 'Tourist', required: true },
        rating: { type: Number, min: 0, max: 5, required: true }
    }],
    averageRating: { type: Number, default: 0 },
    Purchasers: [{ type: mongoose.Types.ObjectId, ref: 'Tourist' }] // List of tourist IDs who purchased the product

}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
