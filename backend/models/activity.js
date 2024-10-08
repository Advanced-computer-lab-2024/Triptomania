import mongoose from 'mongoose';
const { Schema } = mongoose;

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
  category: {
    type: mongoose.Schema.Types.ObjectId, // Refers to ObjectId of activityCategory
    ref: 'activityCategory',
    required: true,
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId, // Array of ObjectId referring to preferenceTags
    ref: 'preferenceTags',
    required: true,
  }],
  specialDiscounts: {
    type: Number,
    default: 0,   
  },
  isBookingOpen: {
    type: Boolean,
    default: true, 
  },
  creatorId: 
  {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;