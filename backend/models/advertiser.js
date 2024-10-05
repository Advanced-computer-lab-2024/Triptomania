//const mongoose = require('mongoose');
import mongoose from 'mongoose';

const Schema =mongoose.Schema;

const AdvertiserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    companyName: { type: String, required: true }, 
    companyHotline: { type: Number }, 
    website: { type: String }, 
    profilePicture: { type: String }, 
    
});


const Advertiser = mongoose.model('Advertiser', AdvertiserSchema);
export default Advertiser;