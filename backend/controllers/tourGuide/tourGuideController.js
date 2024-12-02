// Import TourGuideModel and other modules using ES module syntax
import TourGuideModel from '../../models/tourGuide.js';
import mongoose from 'mongoose';
import ItineraryModel from '../../models/itinerary.js'; // Import the itinerary model


// Function to hash passwords
/*const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex'); // SHA-256 hash
};*/

// Create a new tour guide

const CreateTourGuide = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, mobile, yearsOfExperience, previousWork } = req.body;

    // Check if the username or email already exists
    const existingTourGuide = await TourGuideModel.findOne({
      $or: [{ username }, { email }] // Check for either username or email conflict
    });

    //const hashed = hashPassword(password);

    if (existingTourGuide) {
      // Return an error if the user already exists
      return res.status(400).send({ message: 'Username or email already exists.' });
    }

    // Create a new tour guide
    const tourg = await TourGuideModel.create({ firstName, lastName, username, email, password, mobile , yearsOfExperience , previousWork });
    res.status(201).send(tourg);
  } catch (error) {
    console.log(error);
  }
};

/////////////////////////////////////////////////////

// Get all tour guides
const getTourGuide = async (req, res) => {
  try {
    const tourg = await TourGuideModel.find({});
    return res.status(200).send(tourg);
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////////

// Get one tourguide

const getOneTourGuide = async (req, res) => {
  try {
    //const {  username, email, password, mobile, nationality,job_Student } = req.body;
    const tourGuide = await TourGuideModel.find({username});
    return res.status(200).send(tourGuide);
  } catch (error) {
    console.log(error);
  }
};

//////////////////////////////////////////////////////////////

// Update a tour guide
const updateTourGuide = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, mobile, yearsOfExperience, previousWork } = req.body;
    //const hashed = hashPassword(password);


    // Check if the email already exists

      if (email) {
        const existingTourGuideEmail = await TourGuideModel.findOne({ email, username: { $ne: username } });
        if (existingTourGuideEmail) {
          // Return an error if the email already exists
          return res.status(400).send({ message: 'Email already exists.' });
        }
      }

    const updateData = {  firstName, lastName, email, password, mobile, yearsOfExperience, previousWork };

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Update tour guide data
    const tourg = await TourGuideModel.findOneAndUpdate({ username }, updateData, { new: true }); // Add { new: true } to return the updated document
    if (!tourg) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).send(tourg);
  } catch (error) {
    console.log(error);
  }
};

export const addTour = async (req, res) => {
  try {
     const { activities, locationsToVisit, timeline, duration, language, price, availableDates, availableTimes, accessibility, pickUpLocation, dropOffLocation } = req.body;

     if (!activities || !locationsToVisit || !timeline || !duration || !language || !price || !availableDates || !availableTimes || !pickUpLocation || !dropOffLocation) {
        return res.status(400).json({ message: "All required fields must be provided." });
     }

     if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ message: "Price must be a positive number." });
     }

     const newTour = new TourGuideModel({
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
     const tours = await TourGuideModel.find().sort({ createdAt: -1 }); 
     res.status(200).json(tours);
  } catch (error) {
     res.status(500).json({ message: "Error fetching tours", error: error.message });
  }
};

export const editTour = async (req, res) => {
  try {
     const { id, activities, locationsToVisit, timeline, duration, language, price, availableDates, availableTimes, accessibility, pickUpLocation, dropOffLocation } = req.body;

     if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid tour ID format." });
     }

     if (!activities && !locationsToVisit && !timeline && !duration && !language && !price && !availableDates && !availableTimes && accessibility === undefined && !pickUpLocation && !dropOffLocation) {
        return res.status(400).json({ message: "At least one field must be provided for update." });
     }

     const updatedTour = await TourGuideModel.findOneAndUpdate(
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
     const { id } = req.body;

     if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid tour ID format." });
     }

     const deletedTour = await TourGuideModel.findByIdAndDelete(id);

     if (!deletedTour) {
        return res.status(404).json({ message: "Tour not found" });
     }

     res.status(200).json({ message: "Tour deleted successfully", tour: deletedTour });
  } catch (error) {
     res.status(500).json({ message: "Error deleting tour", error: error.message });
  }
};


// Function to activate or deactivate an itinerary



const toggleItineraryStatus = async (req, res) => {
  const { itineraryId } = req.query; // Extracting itineraryId from query parameters

  try {
      // Validate if the ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(itineraryId)) {
          return res.status(400).json({ message: "Invalid itinerary ID format." });
      }

      // Find the itinerary by ID
      const itinerary = await ItineraryModel.findById(itineraryId);
      
      if (!itinerary) {
          return res.status(404).json({ message: "Itinerary not found." });
      }

      let isActivated = itinerary.isActivated;
    
      // Preserve the creatorId and save the itinerary
      await ItineraryModel.findByIdAndUpdate(itineraryId, { isActivated: !isActivated }, { new: true });

      return res.status(200).json({ message: `Itinerary ${isActivated ? 'deactivated' : 'activated'} successfully.` });
  } catch (error) {
      console.error("Error toggling itinerary status:", error);
      res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}






//////////////////////////////////////////////////////////////////////

// Export all functions using ES module syntax
export default { CreateTourGuide, getTourGuide, updateTourGuide, getOneTourGuide,toggleItineraryStatus };
