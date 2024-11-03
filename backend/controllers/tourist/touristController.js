// Import userModel and other modules using ES module syntax
import userModel from '../../models/tourist.js';

import mongoose from 'mongoose';
import crypto from 'crypto';

// Function to hash passwords
/*const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex'); // SHA-256 hash
};*/

// Create a new tourist
const CreateTourist = async (req, res) => {
  const { username, email, password, mobile, nationality, DOB, job_Student/*, wallet*/ } = req.body;
  //const hashed = hashPassword(Password);
  
  try {
    // Check for existing user by username or email
    const existingTourist = await userModel.findOne({
      $or: [{ username }, { email }]
    });

    if (existingTourist) {
      // Return an error if the user already exists
      return res.status(400).send({ message: 'Username or email already exists.' });
    }

    // Check age requirement
    const dobDate = new Date(DOB);
    const age = new Date().getFullYear() - dobDate.getFullYear();
    const monthDiff = new Date().getMonth() - dobDate.getMonth();
    const isUnderage = age < 18 || (age === 18 && monthDiff < 0);

    // Create a new tourist
    const tourist = await userModel.create({ username, email, password, mobile, nationality, DOB, job_Student, underage: isUnderage });
    res.status(200).json(tourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/////////////////////////////////////////////////////////////////////

// Get all tourists
const getTourist = async (req, res) => {
  try {
    const tourist = await userModel.find();
    return res.status(200).send(tourist);
  } catch (error) {
    console.log(error);
  }
};

////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////

// Get one tourist

const getOneTourist = async (req, res) => {
  try {
   // const {  username, email, password, mobile, nationality,job_Student } = req.body;
    const tourist = await userModel.find({username});
    return res.status(200).send(tourist);
  } catch (error) {
    console.log(error);
  }
};

////////////////////////////////////////////////////////////////


// Update a tourist
const UpdateTourist = async (req, res) => {
  try {
    const { username, email, password, mobile, nationality, job_Student, wallet } = req.body;
    console.log('Request Body:', req.body); // Log the incoming request

    // Fetch the existing tourist data
    const existingTourist = await userModel.findOne({ username });
    if (!existingTourist) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData = {
      email: email !== undefined ? email : existingTourist.email,
      password: password !== undefined ? password : existingTourist.password,
      mobile: mobile !== undefined ? mobile : existingTourist.mobile,
      nationality: nationality !== undefined ? nationality : existingTourist.nationality,
      job_Student: job_Student !== undefined ? job_Student : existingTourist.job_Student,
      wallet: wallet !== undefined ? wallet : existingTourist.wallet
    };

    // Remove undefined fields (optional as we've handled undefined values)
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
    console.log('Update Data:', updateData); // Log what's going to be updated

    // Check if the email already exists but exclude the current user
    if (email && email !== existingTourist.email) {
      const existingTouristEmail = await userModel.findOne({ email, username: { $ne: username } });
      if (existingTouristEmail) {
        return res.status(400).send({ message: 'Email already exists.' });
      }
      updateData.email = email;
    }

    const updatedTourist = await userModel.findOneAndUpdate({ username }, updateData, { new: true });
    if (!updatedTourist) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Updated Tourist:', updatedTourist); // Log the updated document
    res.status(200).json(updatedTourist);
  } catch (error) {
    console.log('Error:', error); // Log the error if there's any
    res.status(400).json({ error: error.message });
  }
};

const addComment = async (req, res) => {
  const { id, type } = req.body; // Get activityId and comment from the request body
  
  try {
    // Check if ID exists
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID format." });
   }

   let addedComment;

  // Add comment depending on the type
  switch(type) 
  {
    case "activity":
      const updatedActivity = await Activity.findByIdAndUpdate(
        activityId,
        { $push: { comments: comment } },
        { new: true } // Return the updated document
      );
  
      // Check if the activity was found and updated
      if (!updatedActivity) {
        return res.status(404).json({ error: 'Activity not found' });
      }
  
      res.status(200).json(updatedActivity); // Send the updated activity with the new comment
    case "tourGuide":
      const updatedTourGuide = await Activity.findByIdAndUpdate(
        activityId,
        { $push: { comments: comment } },
        { new: true } // Return the updated document
      );
  
      // Check if the tour guide was found and updated
      if (!updatedTourGuide) {
        return res.status(404).json({ error: 'Tour guide not found' });
      }
  
      res.status(200).json(updatedTourGuide); // Send the updated itinerary with the new comment
    case "itinerary":
      const updatedIitnerary = await Activity.findByIdAndUpdate(
        activityId,
        { $push: { comments: comment } },
        { new: true } // Return the updated document
      );
  
      // Check if the itinerary was found and updated
      if (!updatedIitnerary) {
        return res.status(404).json({ error: 'Tour guide not found' });
      }
  
      res.status(200).json(updatedIitnerary); // Send the updated itinerary with the new comment
  }
  } catch(error) {
    console.log('Error:', error); // Log the error if there's any
    res.status(400).json({ error: error.message });
  }
}




//////////////////////////////////////////////////////////////////////

// Export all functions using ES module syntax
export default { CreateTourist, getTourist, getOneTourist, UpdateTourist, addComment};
