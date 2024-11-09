import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: "received" },
  touristId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist', required: true },
  reply : { type: String, required: false }
});

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;