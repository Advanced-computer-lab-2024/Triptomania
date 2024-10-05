//const mongoose = require('mongoose');
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const touristSchema = new Schema({
  UserName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true,
  },
  MobileNumber: {
    type: Number,
    required: true,
  },
  Nationality: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  Job_Student: {
    type: String,
    required: true,
  },Wallet: {
    type: Number,
    required: false,
  }
}, { timestamps: true });

const Tourist = mongoose.model('Tourist', touristSchema);

export default Tourist;
