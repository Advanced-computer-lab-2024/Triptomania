import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
  activities: {
    type: [String], 
    required: true,
  },
  locationsToVisit: {
    type: [String], 
    required: true,
  },
  timeline: {
    type: String,       
    required: true,
  },
  duration: {
    type: String, 
    required: true,
  },
  language: {
    type: String, 
    required: true,
  },
  price: {
    type: Number,  
    required: true,
  },
  availableDates: {
    type: [Date], 
    required: true,
  },
  availableTimes: {
    type: [String],  
    required: true,
  },
  accessibility: {
    type: Boolean,  
    default: false, 
  },
  pickUpLocation: {
    type: String,   
    required: true,
  },
  dropOffLocation: {
    type: String,  
    required: true,
  },
}, { timestamps: true });

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;