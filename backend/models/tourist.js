//const mongoose = require('mongoose');
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const touristSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  job_Student: {
    type: String,
    required: true,
  },wallet: {
    type: Number,
    required: false,
    default:0
  },
  type: {
    type: String,
    default: 'tourist'  // Default value for the type field
  },
  underage:{
    type: Boolean,
  },
  points:{
    type: Number,
    required: false,
    default:0
  }
}, { timestamps: true });

touristSchema.pre('save', async function(next){
  const tourist = this;

  if(!tourist.isModified('password')) return next();

  try{
    const saltRounds= 10;
    tourist.password = await bcrypt.hash(tourist.password, saltRounds);
    next();
  }catch(error){
    next(error);
  }
});

touristSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  
  if (update.password) {
    try {
      const saltRounds = 10;
      update.password = await bcrypt.hash(update.password, saltRounds);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Tourist = mongoose.model('Tourist', touristSchema);

export default Tourist;
