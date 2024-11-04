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
  bookingMade:
    {
        type: [mongoose.Types.ObjectId],
        default: []
    },
  tags: [{
    type: mongoose.Schema.Types.ObjectId, // Array of ObjectId referring to preferenceTags
    ref: 'preferenceTags',
    required: true,
  }],
  specialDiscounts: {
    type: [String],
    default: [],   
  },
  isBookingOpen: {
    type: Boolean,
    default: true, 
  },
  creatorId: 
  {
      type: mongoose.Types.ObjectId,
      required: true,
  },
  ratings: 
  {
      type: Number,
      default: 0,
  },
  comments:
  {
    type: [String],
    default: [],
  },
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;