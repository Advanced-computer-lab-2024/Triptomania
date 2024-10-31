import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const historicalPlaceSchema = new Schema({
    Name: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    Picture: {
        type: String,
        required: true, 
    },
    Location: {
        type: String,
        required: true,
    },
    Opening_hours: {
        type: String,
        required: true,
    },
    Closing_hours: {
        type: String,
        required: true,
    },
    Ticket_prices: {
        type: Number,
        required: true,
    },
    Category: {
        type: String,
        required: true,
    },
    Tags: [{         // References the `tags` collection
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tags',  // Referencing the `tags` collection model
        required: false,
    }],
    creatorId: {
        type: mongoose.Types.ObjectId,
        ref: 'tourismgoverners',
        required: true,
    },
}, { timestamps: true });

const HistoricalPlace = mongoose.model('HistoricalPlace', historicalPlaceSchema);
export default HistoricalPlace;
