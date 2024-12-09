//const mongoose = require('mongoose');
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const AdvertiserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String },
  companyName: { type: String },
  companyHotline: { type: Number },
  website: { type: String },
  profilePicture: { type: String },
  type: { type: String, default: 'advertiser' },
  documents: { type: String, required: false, default: 'none' },
  status: { type: String, enum: ['accepted', 'rejected', 'pending'], required: false, default: 'pending' },
  acceptedTerms: { type: Boolean, default: false },
  profilePicture: { type: String, required: false, default: 'none' },
  deleteAccount: {
    type: Boolean,
    default: false
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Date,
  },
  notifications: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification'
    },
    read: {
      type: Boolean,
      default: false
    }
  }]
});


AdvertiserSchema.pre('save', async function (next) {
  const advertiser = this;

  if (!advertiser.isModified('password')) return next();

  try {
    const saltRounds = 10;
    advertiser.password = await bcrypt.hash(advertiser.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

AdvertiserSchema.pre('findOneAndUpdate', async function (next) {
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

const Advertiser = mongoose.model('Advertiser', AdvertiserSchema);
export default Advertiser;