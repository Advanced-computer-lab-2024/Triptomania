//const mongoose = require('mongoose');
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String },
    yearsOfExperience: { type: Number },
    previousWork: { type: String },
},{timestamps:true});

const tourguide = mongoose.model('TourGuide', UserSchema);
export default tourguide;