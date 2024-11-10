import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
    Name: {
        type: String,
        required: true,
    },
    activities: {
        type: [String],
        required: true,
    },
    locationsToVisit: {
        type: [String],
        required: true,
    },
    timeLine: {
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
        type: [String],
        required: true,
    },
    availableTimes: {
        type: [String],
        required: true,
    },
    accesibility: {
        type: [String],
    },
    pickUp: {
        type: String,  // Pickup location
        required: true,
    },
    dropOff: {
        type: String, // Dropoff location
        required: true,
    },
    bookingMade: {
        type: [mongoose.Types.ObjectId],
        default: []
    },
    preferenceTags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PreferenceTag', // Adjust the model name as needed
        required: false,
    }],
    Start_date:{
        type: Date,
        required: true,
    },
    End_date: {
        type: String, // DD/MM/YYYY Date type
        required: true,
    },
    Tags: {
        type: [String], // Array of tags for filtering
        default: [],
    },
    creatorId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    comments: {
        type: [String],
        default: [],
    },
    ratings: [{
        touristId: { type: mongoose.Types.ObjectId, ref: 'Tourist', required: true },
        rating: { type: Number, min: 0, max: 5, required: true }
    }],
    averageRating: { type: Number, default: 0 }
}, { timestamps: true });

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;
