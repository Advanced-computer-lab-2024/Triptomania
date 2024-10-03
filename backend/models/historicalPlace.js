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

    },
    Closing_hours: {

    },
    Ticket_prices: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const HistoricalPlace = mongoose.model('HistoricalPlace', historicalPlaceSchema);
export default HistoricalPlace;