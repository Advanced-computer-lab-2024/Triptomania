import complaintModel from '../../models/complaint.js'; 
import mongoose from 'mongoose';
/**
 * Fetch all complaints and their statuses (pending/resolved).
 * @param {Object} req 
 * @param {Object} res 
 */
const viewComplaints = async (req, res) => {
    try {
        const complaints = await complaintModel.find({}, "title status date body touristId").populate('touristId', 'username');

        if (complaints.length === 0) {
            return res.status(404).json({ message: "No complaints found" });
        }

        
        const formattedComplaints = complaints.map(complaint => ({
            ...complaint.toObject(),
            date: complaint.date ? complaint.date.toISOString() : null 
        }));

        res.status(200).json(formattedComplaints);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};



const sortComplaintsByDate = async (req, res) => {
    try {
        
        let complaints = await complaintModel.find({}, "title status date body touristId").populate('touristId', 'username');

     
        if (complaints.length === 0) {
            return res.status(404).json({ message: "No complaints found" });
        }

        
        complaints = complaints.map(complaint => ({
            ...complaint.toObject(),
            date: new Date(complaint.date)  
        }));

       
        const sortOrder = req.query.sort === 'desc' ? -1 : 1;

        
        complaints.sort((a, b) => {
            if (a.date < b.date) return -1 * sortOrder;
            if (a.date > b.date) return 1 * sortOrder;
            return 0;
        });

        
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


const filterComplaintsByStatus = async (req, res) => {
    try {
        
        const { status } = req.query;

        
        if (!status || !['pending', 'resolved', 'received'].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Must be either 'pending' or 'resolved'." });
        }

       
        const complaints = await complaintModel.find({ status }, "title status date body touristId").populate('touristId', 'username');

        
        if (complaints.length === 0) {
            return res.status(404).json({ message: "No complaints found with the specified status" });
        }

        
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};



const updateComplaintStatus = async (req, res) => {
    try {
        const { id, status } = req.body; 

        
        if (!status || !['pending', 'resolved'].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Must be either 'pending' or 'resolved'." });
        }

        
        const updatedComplaint = await complaintModel.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        
        if (!updatedComplaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

       
        res.status(200).json({ message: "Complaint status updated successfully", complaint: updatedComplaint });
    } catch (error) {
        res.status(500).json({ message: "Error updating complaint status", error: error.message });
    }
};

// view details of a selected complaint by ID
const viewComplaintDetails = async (req, res) => {
    const { id } = req.query;

    try {
        // Validate the complaint ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid complaint ID format." });
        }

        // Find the complaint by ID
        const complaint = await complaintModel.findById(id).populate('touristId', 'username'); // You can modify the fields to include as needed

        // Check if the complaint was found
        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found." });
        }

        // Return the complaint details
        return res.status(200).json({ message: "Complaint details retrieved successfully.", complaint });
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving complaint details", error: error.message });
    }
};

 const replyToComplaint = async (req, res) => {
    const { id, reply } = req.body;

    if (!reply) {
        return res.status(400).json({ message: "Reply content is required." });
    }

    try {
        // Find the complaint by ID and update its reply and status
        const updatedComplaint = await complaintModel.findByIdAndUpdate(
            id,
            { reply, status: "resolved" }, // Update reply content and set status to "resolved"
            { new: true, runValidators: true } // Return the updated document
        );

        // Check if the complaint was found
        if (!updatedComplaint) {
            return res.status(404).json({ message: "Complaint not found." });
        }

        // Respond with the updated complaint
        res.status(200).json({ message: "Reply added successfully", complaint: updatedComplaint });
    } catch (error) {
        res.status(500).json({ message: "Error replying to complaint", error: error.message });
    }
};

export default {
    viewComplaints,
    updateComplaintStatus,
    sortComplaintsByDate,
    filterComplaintsByStatus,
    viewComplaintDetails,
    replyToComplaint
};

