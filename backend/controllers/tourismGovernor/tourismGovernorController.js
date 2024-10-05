import mongoose from "mongoose";
import tourismGovernerModel from '../../models/tourismGovernor.js'

const addTourismGoverner = async (req, res) => {
    const { tourismGovernerName, tourismGovernerUsername, tourismGovernerPassword } = req.body;

    if (!tourismGovernerName || !tourismGovernerUsername || !tourismGovernerPassword) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        const tourismGoverner = new tourismGovernerModel({
            TourismGovernerName: tourismGovernerName,
            TourismGovernerUsername: tourismGovernerUsername,
            TourismGovernerPassword: tourismGovernerPassword
        });

        await tourismGoverner.save();

        res.status(201).json({ message: "Tourism Governer added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export default {
    addTourismGoverner
}