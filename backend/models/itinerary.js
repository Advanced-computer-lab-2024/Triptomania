import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
    Name:
    {
        type: String,
        required: true,
    },
    activities:
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
        type: [String],
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
        type: [mongoose.Types.ObjectId],
        default: []
    },
    preferenceTags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'preferencetags',
        required: false,
    }],
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
    creatorId: 
    {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    comments:
  {
    type: [String],
    required: false,
  },
},  { timestamps: true });
const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;
