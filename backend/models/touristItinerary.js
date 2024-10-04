import mongoose from 'mongoose';
import Activity from './activity';
const Schema = mongoose.Schema;


// Tourist itenerary details
const touristItinerarySchema = new Schema({
    Name:
    {
        type: String,
        required: true,
    },
    activity: 
    {
        type: [Activity],
        required: true,
    },
    Location: 
    {
        type: String,
        required: true,
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
}, { timestamps: true });

const TouristItinerary = mongoose.model('TouristItinerary', touristItinerarySchema);
export default TouristItinerary;