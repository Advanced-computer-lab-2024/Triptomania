import mongoose from 'mongoose';
import itineraryModel from '../../models/itinerary.js';

export const getItinerary = async (req, res) =>
{
    try
    {
        const itinerary = itineraryModel.find();
        res.status(200).json({
            status: true,
            itinerary: itinerary
        });
    }catch(err)
    {
        res.status(500).json({
            status: false,
            error: err.message
        })
    }
}
export const addItinerary = async (req, res) =>
{
    try
    {
        const {Name, activities, locationsToVisit, timeLine, duration, language, price, availableDates, availableTimes, accesibility, pickUp, dropOff, bookingMade} = req.body;

    // Check that parameters are not empty
    if(!Name || !activities || !locationsToVisit || timeLine || !duration || !language || !price || !availableDates || availableTimes || !pickUp || !dropOff || !bookingMade)
    {
        return res.status(400).json({ message: "All required fields must be provided." });
    }

    // Check that parameters' type is right
    if(typeof Name !== 'string')
        {
            return res.status(400).json({ message: "Name must be a string"});
        }
    if(typeof activities !== 'string')
    {
        return res.status(400).json({ message: "Name must be a string"});
    }
    if (Array.isArray(locationsToVisit) && locationsToVisit.every(item => typeof item === 'string'))
    {
        return res.status(400).json({ message: "Activites must be an array of strings"});
    }
    if(typeof timeLine !== 'string')
    {
        return res.status(400).json({ message: "Time line must be a string"});
    }
    if(typeof duration !== 'string')
    {
        return res.status(400).json({ message: "Duration line must be a string"});
    }
    if(typeof language !== 'string')
    {
        return res.status(400).json({ message: "Lnaguage line must be a string"});
    }
    if(typeof price !== 'Number')
    {
        return res.status(400).json({ message: "Price line must be a Number"});
    }
    if (Array.isArray(availableDates) && availableDates.every(item => typeof item === 'string'))
    {
        return res.status(400).json({ message: "Available dates must be a string"});
    }
    if (Array.isArray(availableTimes) && availableTimes.every(item => typeof item === 'string'))
    {
        return res.status(400).json({ message: "Available times must be a string"});
    }
    if (Array.isArray(accesibility) && accesibility.every(item => typeof item === 'string'))
    {
        return res.status(400).json({ message: "Accesibility times must be a string"});
    }
    if(typeof pickUp !== 'string')
    {
        return res.status(400).json({ message: "Pick up must be a string"});
    }
    if(typeof dropOff !== 'string')
    {
        return res.status(400).json({ message: "Drop off must be a string"});
    }
    const newItinerary = new itineraryModel({Name, activities, locationsToVisit, timeLine, duration, language, price, availableDates, availableTimes, accesibility, pickUp, dropOff, bookingMade});
    await newItinerary.save();
    res.status(201).json({
        status: true,
        itinerary: newItinerary
    });
    }catch(err)
    {
        res.status(500).json({
            status: false,
            error: err.message
        });
    }
}

export const editItinerary = async (req, res) =>
{
    try
    {
        const {id} = req.params;
        const{Name, activities, locationsToVisit, timeLine, duration, language, price, availableDates, availableTimes, accesibility, pickUp, dropOff, bookingMade} = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                status: false,
                error: 'Itinerary not found'
            });
        }
        const updatedItinerary = {Name, activities, locationsToVisit, timeLine, duration, language, price, availableDates, availableTimes, accesibility, pickUp, dropOff, bookingMade, _id: id};
        await itineraryModel.findByIdAndUpdate(id, updatedItinerary, {new : true});

    }catch(err)
    {
        res.status(500).json({
            status: false,
            error: err.message
        });
    }
}

export const deleteItinerary = async(req, res) =>
{
    try
    {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                status: false,
                error: 'Itinerary not found'
            });
        }
        const{bookingMade} = req.body();
        const itineraryBooked =  {bookingMade, _id: id}

        // Checks if itinerary is booked
        if(itineraryBooked)
        {
            return res.status(400).json({ message: "Itinerary already booked, can not delete"});
        }else
        {
            await itineraryModel.findByIdAndDelete(id);
            res.status(200).json({
                status: true,
                message: 'Itinerary deleted successfully'
            });
        }
    }catch(err)
    {
        res.status(500).json({
            status: false,
            error: err.message
        });
    }
}

export default
{
    getItinerary,
    addItinerary,
    editItinerary,
    deleteItinerary   
}