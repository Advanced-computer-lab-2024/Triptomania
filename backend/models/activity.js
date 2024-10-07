// advertiser.js (Using ES Modules)
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  name: {
        type: String,
        required: true,
      },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,  
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: { //
    type: String,
    ref: 'activityCategory',
    required: true
  },
  tags: {
    type: String,
    ref: 'preferenceTags',
    required: true,
  },
  specialDiscounts: {
    type: Number,
    default: 0,   
  },
  isBookingOpen: {
    type: Boolean,
    default: true, 
  },
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;