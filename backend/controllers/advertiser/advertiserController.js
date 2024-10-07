import activityModel from '../../models/activity.js'; // Link to advertiser schema
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

 const addActivity = async (req, res) => {
    try {
       const {name,description, date, time, location, price, category, tags, specialDiscounts, isBookingOpen } = req.body;
 
       if (!name || !description || !date || !time || !location || !price || !category || !tags || !specialDiscounts || isBookingOpen === undefined) {
          return res.status(400).json({ message: "All required fields must be provided." });
       }
 
       if (typeof name !== 'string'||typeof description !== 'string' ) {
        return res.status(400).json({ message: "Must be a string" });
     }
       if (typeof price !== 'number' || price <= 0) {
          return res.status(400).json({ message: "Price must be a positive number." });
       }
 
       if (specialDiscounts && (typeof specialDiscounts !== 'number' || specialDiscounts < 0)) {
          return res.status(400).json({ message: "Special discounts must be a non-negative number." });
       }
 
       const newActivity = new activityModel({
          description,
          date,
          time,
          location,
          price,
          category,
          tags,
          specialDiscounts: specialDiscounts || 0, 
          isBookingOpen: isBookingOpen !== undefined ? isBookingOpen : true, 
       });
 
       await newActivity.save();
 
       res.status(201).json({ message: "Booking added successfully", booking: newBooking });
    } catch (error) {
       res.status(500).json({ message: "Error adding booking", error: error.message });
    }
 };
 
 // READ 
  const viewActivities = async (req, res) => {
    try {
       const bookings = await activityModel.find().sort({ createdAt: -1 }); 
       res.status(200).json(bookings);
    } catch (error) {
       res.status(500).json({ message: "Error fetching activities", error: error.message });
    }
 };
 
  const editActivity = async (req, res) => {
    try {
       const { id } = req.params;
       const {name,description, date, time, location, price, category, tags, specialDiscounts, isBookingOpen } = req.body;
 
       if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid booking ID format." });
       }
 
       if (!name || !description || !date || !time || !location || !price || !category || !tags || !specialDiscounts || isBookingOpen === undefined) { 
                  return res.status(400).json({ message: "At least one field must be provided for update." });
       }
 
       const updatedActivity = await activityModel.findOneAndUpdate(
          { _id: id }, 
          {
             $set: {
                name: name !== undefined ? name : undefined,
                description: description !== undefined ? description : undefined,
                date: date !== undefined ? date : undefined,
                time: time !== undefined ? time : undefined,
                location: location !== undefined ? location : undefined,
                price: price !== undefined ? price : undefined,
                category: category !== undefined ? category : undefined,
                tags: tags !== undefined ? tags : undefined,
                specialDiscounts: specialDiscounts !== undefined ? specialDiscounts : undefined,
                isBookingOpen: isBookingOpen !== undefined ? isBookingOpen : undefined,
             }
          }, 
          { new: true, runValidators: true } 
       );
 
       if (!updatedActivity) {
          return res.status(404).json({ message: "Booking not found" });
       }
 
       res.status(200).json({ message: "Activity updated successfully", booking: updatedActivity });
    } catch (error) {
       res.status(500).json({ message: "Error updating actvivty", error: error.message });
    }
 };
 
  const deleteActvivty = async (req, res) => {
    try {
       const { id } = req.params;
 
       if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid booking ID format." });
       }
 
       const deletedActivity = await activityModel.findByIdAndDelete(id);
 
       if (!deletedActivity) {
          return res.status(404).json({ message: "Booking not found" });
       }
 
       res.status(200).json({ message: "Actvivty deleted successfully", activity: deletedActivity });
    } catch (error) {
       res.status(500).json({ message: "Error deleting activivty", error: error.message });
    }
    
 };


 export default{
    addActivity,
    editActivity,
    viewActivities,
    deleteActvivty,
    createAdvertiser,
    getAdvertiser,
    updateAdvertiser,
    getOneAdvertiser
 }
