// Import AdvertiserModel and other modules using ES module syntax
import AdvertiserModel from '../../models/advertiser.js';
import mongoose from 'mongoose';
//import crypto from 'crypto';

// Function to hash passwords
/*const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex'); // SHA-256 hash
};*/

// Create new advertiser
const createAdvertiser = async (req, res) => {
  try {
    const { username, email, password, mobile, companyName, companyHotline, website/*, profilePicture*/ } = req.body;

    // Check if the username or email already exists
    const existingAdvertiser = await AdvertiserModel.findOne({
      $or: [{ username }, { email }]
    });

    //const hashed = hashPassword(password);

    if (existingAdvertiser) {
      // Return an error if the user already exists
      return res.status(400).send({ message: 'Username or email already exists.' });
    }

    // Create new advertiser
    const adv = await AdvertiserModel.create({
      username,
      email,
      password,
      mobile,
      companyName,
      companyHotline,
      website/*,
      profilePicture*/
    });

    res.status(201).send(adv);
  } catch (error) {
    console.log(error);
  }
};
///////////////////////////////////////////////////////////////////

// Get one seller

const getOneAdvertiser = async (req, res) => {
  try {
    //const {  username, email, password, mobile, nationality,job_Student } = req.body;
    const advertiser = await AdvertiserModel.find({username});
    return res.status(200).send(advertiser);
  } catch (error) {
    console.log(error);
  }
};
///////////////////////////////////////////////////////////////////////

// Get all advertisers
const getAdvertiser = async (req, res) => {
  try {
    const adv = await AdvertiserModel.find({});
    return res.status(200).send(adv);
  } catch (error) {
    console.log(error);
  }
};

//////////////////////////////////////////////////////////////////////

// Update an advertiser
const updateAdvertiser = async (req, res) => {
  try {
    const { username, email, password, mobile, companyName, companyHotline, website/*, profilePicture*/ } = req.body;
    const updateData = { username, email,password, mobile, companyName, companyHotline, website/*, profilePicture*/ };
    //const hashed = hashPassword(password);

    // Check if the hashed password or email already exists
    //const advertiserPassword = await AdvertiserModel.findOne({ password });
    if (email) {
      const existingAdvertiserEmail = await AdvertiserModel.findOne({ email, username: { $ne: username } });
      if (existingAdvertiserEmail) {
        // Return an error if the email already exists
        return res.status(400).send({ message: 'Email already exists.' });
      }
    }

    // Update advertiser data
    const adv = await AdvertiserModel.findOneAndUpdate(
      { username }, // Find by username
       updateData, // Update data
      { new: true } // Return the updated document
    );

    if (!adv) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).send(adv);
  } catch (error) {
    console.log(error);
  }
};

export default { createAdvertiser, getAdvertiser, updateAdvertiser,getOneAdvertiser};
