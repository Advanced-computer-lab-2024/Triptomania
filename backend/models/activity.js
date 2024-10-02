import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const activitySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Remove whitespace from both ends
      },
      date: {
        type: Date,
        required: true,
      },
      time: {
        type: String, // You might want to use a specific format (e.g., 'HH:MM AM/PM')
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
        type: String,
        required: true, // e.g., "Outdoor", "Indoor", etc.
      },
      tags: {
        type: [String], // Array of tags for filtering
        default: [],
      },
      specialDiscount: {
        type: Number,
        default: 0, // Percentage discount, e.g., 20 for 20% off
      },
      bookingOpen: {
        type: Boolean,
        default: true, // Whether the activity is available for booking
      },
},  { timestamps: true });
const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
