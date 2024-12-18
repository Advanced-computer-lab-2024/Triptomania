import mongoose from 'mongoose';
import historicalPlaceModel from '../../models/historicalPlace.js';
import Tag from '../../models/tag.js';
const getHistoricalPlaces = async (req, res) => {
    try {
        const historicalPlaces = await historicalPlaceModel
            .find()
            .populate('Tags'); // Add this line to populate Tags

        res.status(200).json({
            status: true,
            historicalPlaces: historicalPlaces
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        });
    }
}
const getHistoricalPlace = async (req, res) => {
    const { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
          status: false,
          error: 'Historical place not found'
        });
      }
      const historicalPlace = await historicalPlaceModel.findById(id);
      if (!historicalPlace) {
        return res.status(404).json({
          status: false,
          error: 'Historical place not found'
        });
      }
      res.status(200).json({
        status: true,
        data: historicalPlace
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        error: err.message
      });
    }
  };


const addHistoricalPlace = async (req, res) => {
    
    try {
        const { Name, Description, Picture, Location, Opening_hours, Closing_hours, Ticket_prices, Tags } = req.body;
        const creatorId = req.user._id;
        // Check that all required fields are provided
        if (!Name || !Description || !Picture || !Location || !Opening_hours || !Closing_hours || !Ticket_prices || !Tags || !creatorId) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        // Check that parameters' types are correct
        if (typeof Name !== 'string') {
            return res.status(400).json({ message: "Name must be a string" });
        }
        if (typeof Location !== 'string') {
            return res.status(400).json({ message: "Location must be a string" });
        }
        if (typeof Description !== 'string') {
            return res.status(400).json({ message: "Description must be a string" });
        }
        if (typeof Picture !== 'string') {
            return res.status(400).json({ message: "Picture must be a string" });
        }

        // Validate time format for Opening_hours and Closing_hours
        const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM format
        if (!timeFormat.test(Opening_hours)) {
            return res.status(400).json({ message: "Opening hours must be in the format of HH:MM" });
        }
        if (!timeFormat.test(Closing_hours)) {
            return res.status(400).json({ message: "Closing hours must be in the format of HH:MM" });
        }
        // if (typeof Ticket_prices !== 'integer' || Ticket_prices <= 0) {
        //     return res.status(400).json({ message: "Ticket prices must be a positive number" });
        // }
        // if(typeof creatorId !== 'number')
        // {
        //     return res.status(400).json({ message: "ID must be a number."});
        // }

        // Create a new historical place
        const newHistoricalPlace = new historicalPlaceModel({ 
            Name, 
            Description, 
            Picture, 
            Location, 
            Opening_hours, 
            Closing_hours, 
            Ticket_prices, 
            Tags,
            creatorId
        });

        // Save the historical place to the database
        await newHistoricalPlace.save();
        res.status(201).json({
            status: true,
            historicalPlace: newHistoricalPlace
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        });
    }
}

const editHistoricalPlace = async (req, res) => {
    try {;
        const { id, Name, Description, Location, Opening_hours, Closing_hours, Ticket_prices } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                status: false,
                error: 'Historical place not found'
            });
        }
        const updatedHistoricalPlace = { Name, Description, Location, Opening_hours, Closing_hours, Ticket_prices, _id: id };
        await historicalPlaceModel.findByIdAndUpdate(id, updatedHistoricalPlace, { new: true });
        res.status(200).json({
            status: true,
            historicalPlace: updatedHistoricalPlace
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        });
    }
}

const deleteHistoricalPlace = async (req, res) => {
    try {
        const { id } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                status: false,
                error: 'Historical place not found'
            });
        }
        await historicalPlaceModel.findByIdAndDelete(id);
        res.status(200).json({
            status: true,
            message: 'Historical place deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        });
    }
}

const getMyHistoricalPlaces = async (req, res) => {
    const creatorId = req.user._id;

    try {
        const historicalPlaces = await historicalPlaceModel.find({ creatorId: creatorId }).populate('Tags');

        // Check if any historical places were found
        if (!historicalPlaces || historicalPlaces.length === 0) {
            return res.status(404).json({
                status: false,
                error: 'No historical places found for the provided creatorId.'
            });
        }

        res.status(200).json({
            status: true,
            historicalPlaces: historicalPlaces
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        });
    }
};
const uploadPicture = async (req, res) => {
    try {
        const { id } = req.body;
 
        // Check if a file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: "Historical place image is required." });
        }
 
        // Convert the file buffer to a Base64 string
        const base64Image = req.file.buffer.toString('base64');
 
        // Update the historical place with the new image
        const updatedPlace = await historicalPlaceModel.findByIdAndUpdate(
            id,
            { Picture: base64Image },
            { new: true, runValidators: true }
        );
 
        // Check if the place was found
        if (!updatedPlace) {
            return res.status(404).json({ message: "Historical place not found." });
        }
 
        // Return the updated place
        res.status(200).json({ message: "Uploaded successfully", data: updatedPlace });
    } catch (error) {
        res.status(500).json({ message: "Error uploading photo", error: error.message });
    }
 };

export default {
    getHistoricalPlaces,
    getHistoricalPlace,
    addHistoricalPlace,
    editHistoricalPlace,
    deleteHistoricalPlace,
    getMyHistoricalPlaces,
    uploadPicture
}