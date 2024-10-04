import mongoose from "mongoose";
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    AdminName: {
        type: String,
        required: true,
    },
    AdminUsername: {
        type: String,
        required: true,
    },
    AdminPassword: {
        type: String,
        required: true,
    }
});

const Admin = mongoose.model('admin', adminSchema);
export default Admin;