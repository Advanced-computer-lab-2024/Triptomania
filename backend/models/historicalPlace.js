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
        type: Date,
        required: true,
    },
    Closing_hours: {
        type: Date,
        required: true,
    },
    Ticket_prices: {
        type: Number,
        required: true,
    },
    Category: {
        type: String,
        required: true,
    }
    ,
    Tags: {
        type: [String],
        required: true,
    }

}, { timestamps: true });

const HistoricalPlace = mongoose.model('HistoricalPlace', historicalPlaceSchema);
export default HistoricalPlace;