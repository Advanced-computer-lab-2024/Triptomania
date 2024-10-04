import mongoose from 'mongoose';
const Schema = mongoose.Schema;


// Tourist itenerary details
const touristItinerarySchema = new Schema({
    Name: 
    {
        type: String,
        required: true,
    },
    Location: 
    {
        type: String,
        required: true,
    },
    Start_date:
    {
        type: Date,
        required: true,
    },
    End_date:
    {
        type: Date,
        required: true,
    },
    Tags:
    {
        type: [String], // Array of tags for filtering
        default: [],
    },
    BookingMade:
    {
        type: Boolean,
        required: true, // Check if booking is made
    },
}, { timestamps: true });

const TouristItinerary = mongoose.model('TouristItinerary', touristItinerarySchema);
export default TouristItinerary;