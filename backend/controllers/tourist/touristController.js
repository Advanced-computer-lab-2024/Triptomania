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
  const { username, email, password, mobile, nationality, DOB, job_Student, wallet } = req.body;
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

    if (isUnderage) {
      return res.status(400).send({ message: 'You must be at least 18 years old to register.' });
    }

    // Create a new tourist
    const tourist = await userModel.create({ username, email, password, mobile, nationality, DOB, job_Student, wallet });
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

// Update a tourist
const UpdateTourist = async (req, res) => {
  try {
    const {  username, email, password, mobile, nationality,job_Student } = req.body;
    //const hashed = hashPassword(Password);

    // Check if the email already exists
    if (email) {
      const existingTouristEmail = await userModel.findOne({ email });
      if (existingTouristEmail) {
        // Return an error if the email already exists
        return res.status(400).send({ message: 'Email already exists.' });
      }
      updateData.email = email; // Add email to update data if it exists
    }

    const updateData = {
      username,
      email,
      password,
      mobile,
      nationality,
      job_Student,
    };

    // Remove undefined fields (in case the user didn't update all fields)
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Update tourist data
    const update = await userModel.findOneAndUpdate({ username }, updateData, { new: true }); // Add { new: true } to return the updated document

    if (!update) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(update);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

//////////////////////////////////////////////////////////////////////

// Export all functions using ES module syntax
export default { CreateTourist, getTourist, UpdateTourist };
