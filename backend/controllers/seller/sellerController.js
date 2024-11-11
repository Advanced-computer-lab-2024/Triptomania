// Import SellerModel and other modules using ES module syntax
import SellerModel from '../../models/seller.js';
import mongoose from 'mongoose';
//import crypto from 'crypto';

// Function to hash passwords
/*const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex'); // SHA-256 hash
};*/

// Create a new seller
const CreateSeller = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, mobile, description } = req.body;

    // Check if the username or email already exists
    const existingSeller = await SellerModel.findOne({
      $or: [{ username }, { email }]
    });

    //const hashed = hashPassword(password);

    if (existingSeller) {
      // Return an error if the user already exists
      return res.status(400).send({ message: 'Username or email already exists.' });
    }

    // Create new seller
    const seller = await SellerModel.create({
      firstName, 
      lastName,
      username,
      email,
      password,
      mobile,
      description
    });

    res.status(201).send(seller);
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////////

// Get one seller

const getOneSeller = async (req, res) => {
  try {
    //const {  username, email, password, mobile, nationality,job_Student } = req.body;
    const seller = await SellerModel.find({username});
    return res.status(200).send(seller);
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////

// Get all sellers
const getSeller = async (req, res) => {
  try {
    const seller = await SellerModel.find({});
    return res.status(200).send(seller);
  } catch (error) {
    console.log(error);
  }
};

////////////////////////////////////////////////////

// Update a seller
const updateSeller = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, mobile, description } = req.body;
    //const hashed = hashPassword(password);
    const updateData = { firstName, lastName, username, email, password, mobile, description };

    // Check if the email already exists
    if (email) {
      const existingSellerEmail = await SellerModel.findOne({ email, username: { $ne: username } });
      if (existingSellerEmail) {
        // Return an error if the email already exists
        return res.status(400).send({ message: 'Email already exists.' });
      }
    }

    // Update seller data
    const seller = await SellerModel.findOneAndUpdate(
      { username }, // Find by username
      updateData , // Update data
      { new: true } // Return the updated document
    );

    if (!seller) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).send(seller);
  } catch (error) {
    console.log(error);
  }
};

/////////////////////////////////////////////////////////////////

// Export all functions using ES module syntax
export default { CreateSeller, getSeller, updateSeller, getOneSeller };
