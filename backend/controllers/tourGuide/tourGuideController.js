// Import TourGuideModel and other modules using ES module syntax
import TourGuideModel from '../../models/tourGuide.js';
import mongoose from 'mongoose';


// Function to hash passwords
/*const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex'); // SHA-256 hash
};*/

// Create a new tour guide
const CreateTourGuide = async (req, res) => {
  try {
    const { username, email, password, mobile, yearsOfExperience, previousWork } = req.body;

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
    const tourg = await TourGuideModel.create({ username, email, password, mobile, yearsOfExperience, previousWork });
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
    const { username, email, password, mobile, yearsOfExperience, previousWork } = req.body;
    //const hashed = hashPassword(password);


    // Check if the email already exists

      if (email) {
        const existingTourGuideEmail = await TourGuideModel.findOne({ email, username: { $ne: username } });
        if (existingTourGuideEmail) {
          // Return an error if the email already exists
          return res.status(400).send({ message: 'Email already exists.' });
        }
      }

    const updateData = {  email, password, mobile, yearsOfExperience, previousWork };

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

//////////////////////////////////////////////////////////////////////

// Export all functions using ES module syntax
export default { CreateTourGuide, getTourGuide, updateTourGuide, getOneTourGuide };
