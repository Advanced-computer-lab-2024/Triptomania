import mongoose from 'mongoose';
import itineraryModel from '../../models/itinerary.js'; // Import your itinerary model

// CREATE - Add a new itinerary
export const addItinerary = async (req, res) => {
    try {
        const { activities, locationsToVisit, timeline, duration, language, price, availableDates, availableTimes, accessibility, pickUpLocation, dropOffLocation } = req.body;

        // Validate required fields
        if (!activities || !locationsToVisit || !timeline || !duration || !language || price === undefined || !availableDates || !availableTimes || !pickUpLocation || !dropOffLocation) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        // Create new itinerary
        const newItinerary = new itineraryModel({
            activities,
            locationsToVisit,
            timeline,
            duration,
            language,
            price,
            availableDates,
            availableTimes,
            accessibility: accessibility || false,
            pickUpLocation,
            dropOffLocation
        });

        await newItinerary.save();

        res.status(201).json({ message: "Itinerary added successfully", itinerary: newItinerary });
    } catch (error) {
        res.status(500).json({ message: "Error adding itinerary", error: error.message });
    }
};

// READ - View all itineraries
export const viewItineraries = async (req, res) => {
    try {
        const itineraries = await itineraryModel.find().sort({ createdAt: -1 });
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ message: "Error fetching itineraries", error: error.message });
    }
};

// UPDATE - Edit an existing itinerary
export const editItinerary = async (req, res) => {
    try {
        const { id } = req.params;
        const { activities, locationsToVisit, timeline, duration, language, price, availableDates, availableTimes, accessibility, pickUpLocation, dropOffLocation } = req.body;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid itinerary ID format." });
        }

        // Update itinerary
        const updatedItinerary = await itineraryModel.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    activities: activities !== undefined ? activities : undefined,
                    locationsToVisit: locationsToVisit !== undefined ? locationsToVisit : undefined,
                    timeline: timeline !== undefined ? timeline : undefined,
                    duration: duration !== undefined ? duration : undefined,
                    language: language !== undefined ? language : undefined,
                    price: price !== undefined ? price : undefined,
                    availableDates: availableDates !== undefined ? availableDates : undefined,
                    availableTimes: availableTimes !== undefined ? availableTimes : undefined,
                    accessibility: accessibility !== undefined ? accessibility : undefined,
                    pickUpLocation: pickUpLocation !== undefined ? pickUpLocation : undefined,
                    dropOffLocation: dropOffLocation !== undefined ? dropOffLocation : undefined,
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedItinerary) {
            return res.status(404).json({ message: "Itinerary not found" });
        }

        res.status(200).json({ message: "Itinerary updated successfully", itinerary: updatedItinerary });
    } catch (error) {
        res.status(500).json({ message: "Error updating itinerary", error: error.message });
    }
};

// DELETE - Delete an itinerary
export const deleteItinerary = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid itinerary ID format." });
        }

        const deletedItinerary = await itineraryModel.findByIdAndDelete(id);

        if (!deletedItinerary) {
            return res.status(404).json({ message: "Itinerary not found" });
        }

        res.status(200).json({ message: "Itinerary deleted successfully", itinerary: deletedItinerary });
    } catch (error) {
        res.status(500).json({ message: "Error deleting itinerary", error: error.message });
    }
};


