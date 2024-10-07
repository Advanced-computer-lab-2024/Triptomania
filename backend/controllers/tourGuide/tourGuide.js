import tourGuideModel from '../../models/itinerary.js'; 
import mongoose from 'mongoose'; 

export const addTour = async (req, res) => {
   try {
      const { activities, locationsToVisit, timeline, duration, language, price, availableDates, availableTimes, accessibility, pickUpLocation, dropOffLocation } = req.body;

      if (!activities || !locationsToVisit || !timeline || !duration || !language || !price || !availableDates || !availableTimes || !pickUpLocation || !dropOffLocation) {
         return res.status(400).json({ message: "All required fields must be provided." });
      }

      if (typeof price !== 'number' || price <= 0) {
         return res.status(400).json({ message: "Price must be a positive number." });
      }

      const newTour = new tourGuideModel({
         activities,
         locationsToVisit,
         timeline,
         duration,
         language,
         price,
         availableDates,
         availableTimes,
         accessibility: accessibility !== undefined ? accessibility : false, // Default to false if not provided
         pickUpLocation,
         dropOffLocation,
      });

      await newTour.save();

      res.status(201).json({ message: "Tour added successfully", tour: newTour });
   } catch (error) {
      res.status(500).json({ message: "Error adding tour", error: error.message });
   }
};

export const getTours = async (req, res) => {
   try {
      const tours = await tourGuideModel.find().sort({ createdAt: -1 }); 
      res.status(200).json(tours);
   } catch (error) {
      res.status(500).json({ message: "Error fetching tours", error: error.message });
   }
};

export const editTour = async (req, res) => {
   try {
      const { id } = req.params;
      const { activities, locationsToVisit, timeline, duration, language, price, availableDates, availableTimes, accessibility, pickUpLocation, dropOffLocation } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({ message: "Invalid tour ID format." });
      }

      if (!activities && !locationsToVisit && !timeline && !duration && !language && !price && !availableDates && !availableTimes && accessibility === undefined && !pickUpLocation && !dropOffLocation) {
         return res.status(400).json({ message: "At least one field must be provided for update." });
      }

      const updatedTour = await tourGuideModel.findOneAndUpdate(
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

      if (!updatedTour) {
         return res.status(404).json({ message: "Tour not found" });
      }

      res.status(200).json({ message: "Tour updated successfully", tour: updatedTour });
   } catch (error) {
      res.status(500).json({ message: "Error updating tour", error: error.message });
   }
};

export const deleteTour = async (req, res) => {
   try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({ message: "Invalid tour ID format." });
      }

      const deletedTour = await tourGuideModel.findByIdAndDelete(id);

      if (!deletedTour) {
         return res.status(404).json({ message: "Tour not found" });
      }

      res.status(200).json({ message: "Tour deleted successfully", tour: deletedTour });
   } catch (error) {
      res.status(500).json({ message: "Error deleting tour", error: error.message });
   }
};