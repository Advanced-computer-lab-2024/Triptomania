//const mongoose = require('mongoose');
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SellerSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    description: { type: String }, 
    
}, {timestamps:true});
const Seller = mongoose.model('Seller', SellerSchema);
export default Seller;