import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const itinerarySchema = new Schema({
    Name:
    {
        type: String,
        required: true,
    },
    activity:
    {
        type: [String],
        required: true,
    },
    locationsToVisit:
    {
        type: [String],
        required: true,
    },
    timeLine:
    {
        type: String, 
        required: true,
    },
    duration:
    {
        type: String,
        required: true,
    },
    language:
    {
        type: String,
        required: true,
    },
    price: 
    {
        type: Number,
        required: true,
    },
    availableDates:
    {
        type: [Date],
        required: true,
    },
    availableTimes:
    {
        type: [String],
        required: true,
    },
    accesibility:
    {
        type: [String],
    },
    pickUp:
    {
        type: String,  // Pickup location
        required: true,
    },
    dropOff:
    {
        type: String, // Dropoff location
        required: true,
    },
    bookingMade:
    {
        type: Boolean,
        required: true, // Check if booking is made
    },
    Start_date:
    {
        type: String, // DD/MM/YYYY Date type
        required: true,
    },
    End_date:
    {
        type: String, // DD/MM/YYYY Date type
        required: true,
    },
    Tags:
    {
        type: [String], // Array of tags for filtering
        default: [],
    },
},  { timestamps: true });
const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;
